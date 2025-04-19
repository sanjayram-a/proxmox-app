from proxmoxer import ProxmoxAPI
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv
from ..models.virtual_machine import VMType, VMStatus

load_dotenv()

class ProxmoxService:
    def __init__(self):
        self.proxmox = ProxmoxAPI(
            host=os.getenv("PROXMOX_HOST", "localhost"),
            user=os.getenv("PROXMOX_USER", "root@pam"),
            password=os.getenv("PROXMOX_PASSWORD", ""),
            verify_ssl=False
        )

    async def create_vm(
        self,
        name: str,
        vm_type: VMType,
        cpu_cores: int,
        memory_mb: int,
        disk_size: int,
        node: str
    ) -> int:
        """Create a new VM or Container in Proxmox."""
        try:
            if vm_type == VMType.KVM:
                return await self._create_kvm(name, cpu_cores, memory_mb, disk_size, node)
            else:
                return await self._create_lxc(name, cpu_cores, memory_mb, disk_size, node)
        except Exception as e:
            raise Exception(f"Failed to create {vm_type.value}: {str(e)}")

    async def _create_kvm(self, name: str, cpu: int, memory: int, disk: int, node: str) -> int:
        """Create a KVM virtual machine."""
        next_vmid = self._get_next_vmid()
        
        # Create VM
        self.proxmox.nodes(node).qemu.create(
            vmid=next_vmid,
            name=name,
            cpu=cpu,
            memory=memory,
            disk=f"local-lvm:{disk}",
            net0="virtio,bridge=vmbr0",
            ostype="l26",  # Linux 2.6+ kernel
        )
        
        return next_vmid

    async def _create_lxc(self, name: str, cpu: int, memory: int, disk: int, node: str) -> int:
        """Create a Linux Container."""
        next_vmid = self._get_next_vmid()
        
        # Create Container
        self.proxmox.nodes(node).lxc.create(
            vmid=next_vmid,
            hostname=name,
            cores=cpu,
            memory=memory,
            rootfs=f"local-lvm:{disk}",
            net0="name=eth0,bridge=vmbr0,ip=dhcp",
            ostemplate="local:vztmpl/ubuntu-20.04-standard_20.04-1_amd64.tar.gz"
        )
        
        return next_vmid

    def _get_next_vmid(self) -> int:
        """Get the next available VM ID."""
        vmid = 100  # Start from 100
        while True:
            try:
                self.proxmox.cluster.resources.get(vmid=vmid)
                vmid += 1
            except:
                return vmid

    async def update_vm(self, vmid: int, updates: Dict[str, Any]) -> None:
        """Update VM configuration."""
        try:
            if 'cpu_cores' in updates:
                self.proxmox.nodes('proxmox').qemu(vmid).config.put(cores=updates['cpu_cores'])
            if 'memory_mb' in updates:
                self.proxmox.nodes('proxmox').qemu(vmid).config.put(memory=updates['memory_mb'])
        except Exception as e:
            raise Exception(f"Failed to update VM {vmid}: {str(e)}")

    async def vm_action(self, vmid: int, action: str) -> None:
        """Perform action on VM."""
        try:
            node = self._get_vm_node(vmid)
            if not node:
                raise Exception(f"VM {vmid} not found")

            vm = self.proxmox.nodes(node).qemu(vmid)
            
            actions = {
                "start": vm.status.start,
                "stop": vm.status.stop,
                "restart": vm.status.restart,
                "suspend": vm.status.suspend
            }
            
            if action not in actions:
                raise Exception(f"Invalid action: {action}")
            
            actions[action].post()
        except Exception as e:
            raise Exception(f"Failed to perform action {action} on VM {vmid}: {str(e)}")

    async def delete_vm(self, vmid: int) -> None:
        """Delete a VM."""
        try:
            node = self._get_vm_node(vmid)
            if not node:
                raise Exception(f"VM {vmid} not found")

            # Stop VM if running
            try:
                self.proxmox.nodes(node).qemu(vmid).status.stop.post()
            except:
                pass  # Ignore if already stopped

            # Delete VM
            self.proxmox.nodes(node).qemu(vmid).delete()
        except Exception as e:
            raise Exception(f"Failed to delete VM {vmid}: {str(e)}")

    def _get_vm_node(self, vmid: int) -> Optional[str]:
        """Get the node name where a VM is located."""
        for resource in self.proxmox.cluster.resources.get():
            if resource['type'] in ['qemu', 'lxc'] and resource['vmid'] == vmid:
                return resource['node']
        return None

    async def get_vm_status(self, vmid: int) -> Dict[str, Any]:
        """Get VM status and resource usage."""
        try:
            node = self._get_vm_node(vmid)
            if not node:
                raise Exception(f"VM {vmid} not found")

            vm = self.proxmox.nodes(node).qemu(vmid).status.current.get()
            
            return {
                "status": VMStatus.RUNNING if vm['status'] == 'running' else VMStatus.STOPPED,
                "cpu_usage": vm.get('cpu', 0) * 100,  # Convert to percentage
                "memory_usage": (vm.get('mem', 0) / vm.get('maxmem', 1)) * 100,
                "disk_usage": vm.get('disk', 0)
            }
        except Exception as e:
            raise Exception(f"Failed to get VM {vmid} status: {str(e)}")