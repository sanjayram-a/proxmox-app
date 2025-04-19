from pydantic import BaseModel, Field
from typing import Optional, Dict
from ..models.virtual_machine import VMType, VMStatus

class VMBase(BaseModel):
    name: str
    vm_type: VMType
    cpu_cores: int = Field(ge=1, default=1)
    memory_mb: int = Field(ge=512, default=1024)
    disk_size: int = Field(ge=5, default=10)
    rdp_enabled: bool = True
    ssh_enabled: bool = True

class VMCreate(VMBase):
    proxmox_node: str
    owner_id: Optional[int] = None

class VMUpdate(BaseModel):
    name: Optional[str] = None
    cpu_cores: Optional[int] = Field(ge=1, default=None)
    memory_mb: Optional[int] = Field(ge=512, default=None)
    disk_size: Optional[int] = Field(ge=5, default=None)
    rdp_enabled: Optional[bool] = None
    ssh_enabled: Optional[bool] = None

class VMResponse(VMBase):
    id: int
    proxmox_id: int
    proxmox_node: str
    status: VMStatus
    ip_address: Optional[str]
    mac_address: Optional[str]
    ssh_port: Optional[int]
    rdp_port: Optional[int]
    owner_id: int
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    owner_name: Optional[str]
    resource_status: Dict[str, float]

    class Config:
        from_attributes = True

class VMAction(BaseModel):
    action: str = Field(..., description="Action to perform on VM: start, stop, restart, suspend")