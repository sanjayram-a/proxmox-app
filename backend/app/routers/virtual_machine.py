from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..models.user import User, UserRole
from ..models.virtual_machine import VirtualMachine, VMStatus
from ..schemas.virtual_machine import VMCreate, VMUpdate, VMResponse, VMAction
from ..database import get_db
from ..routers.auth import get_current_user
from ..services.proxmox import ProxmoxService

router = APIRouter(prefix="/vm", tags=["virtual machines"])

@router.get("/", response_model=List[VMResponse])
async def list_vms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all VMs accessible to the current user."""
    if current_user.role == UserRole.ADMIN:
        vms = db.query(VirtualMachine).all()
    else:
        vms = db.query(VirtualMachine).filter(VirtualMachine.owner_id == current_user.id).all()
    return vms

@router.post("/", response_model=VMResponse)
async def create_vm(
    vm_data: VMCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new virtual machine."""
    # Check user permissions
    if current_user.role == UserRole.STUDENT and vm_data.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Students can only create VMs for themselves"
        )
    
    proxmox = ProxmoxService()
    
    # Create VM in Proxmox
    try:
        proxmox_id = await proxmox.create_vm(
            name=vm_data.name,
            vm_type=vm_data.vm_type,
            cpu_cores=vm_data.cpu_cores,
            memory_mb=vm_data.memory_mb,
            disk_size=vm_data.disk_size,
            node=vm_data.proxmox_node
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create VM in Proxmox: {str(e)}"
        )
    
    # Create VM record in database
    db_vm = VirtualMachine(
        **vm_data.dict(),
        proxmox_id=proxmox_id,
        owner_id=vm_data.owner_id or current_user.id,
        status=VMStatus.STOPPED
    )
    
    db.add(db_vm)
    db.commit()
    db.refresh(db_vm)
    return db_vm

@router.get("/{vm_id}", response_model=VMResponse)
async def get_vm(
    vm_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific VM."""
    vm = db.query(VirtualMachine).filter(VirtualMachine.id == vm_id).first()
    if not vm:
        raise HTTPException(status_code=404, detail="VM not found")
    
    if current_user.role != UserRole.ADMIN and vm.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this VM")
    
    return vm

@router.put("/{vm_id}", response_model=VMResponse)
async def update_vm(
    vm_id: int,
    vm_data: VMUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update VM configuration."""
    vm = db.query(VirtualMachine).filter(VirtualMachine.id == vm_id).first()
    if not vm:
        raise HTTPException(status_code=404, detail="VM not found")
    
    if current_user.role != UserRole.ADMIN and vm.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this VM")
    
    # Update VM in Proxmox
    proxmox = ProxmoxService()
    try:
        await proxmox.update_vm(
            vm.proxmox_id,
            vm_data.dict(exclude_unset=True)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update VM in Proxmox: {str(e)}")
    
    # Update database record
    for key, value in vm_data.dict(exclude_unset=True).items():
        setattr(vm, key, value)
    
    db.commit()
    db.refresh(vm)
    return vm

@router.post("/{vm_id}/action", response_model=VMResponse)
async def vm_action(
    vm_id: int,
    action: VMAction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Perform action on VM (start, stop, restart, suspend)."""
    vm = db.query(VirtualMachine).filter(VirtualMachine.id == vm_id).first()
    if not vm:
        raise HTTPException(status_code=404, detail="VM not found")
    
    if current_user.role != UserRole.ADMIN and vm.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to perform actions on this VM")
    
    proxmox = ProxmoxService()
    try:
        await proxmox.vm_action(vm.proxmox_id, action.action)
        # Update VM status based on action
        status_map = {
            "start": VMStatus.RUNNING,
            "stop": VMStatus.STOPPED,
            "restart": VMStatus.RUNNING,
            "suspend": VMStatus.SUSPENDED
        }
        vm.status = status_map.get(action.action, vm.status)
        db.commit()
        db.refresh(vm)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to perform action: {str(e)}")
    
    return vm

@router.delete("/{vm_id}")
async def delete_vm(
    vm_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a VM."""
    vm = db.query(VirtualMachine).filter(VirtualMachine.id == vm_id).first()
    if not vm:
        raise HTTPException(status_code=404, detail="VM not found")
    
    if current_user.role != UserRole.ADMIN and vm.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this VM")
    
    # Delete VM from Proxmox
    proxmox = ProxmoxService()
    try:
        await proxmox.delete_vm(vm.proxmox_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete VM from Proxmox: {str(e)}")
    
    # Delete from database
    db.delete(vm)
    db.commit()
    
    return {"detail": "VM deleted successfully"}