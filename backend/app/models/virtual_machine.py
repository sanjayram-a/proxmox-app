from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, Float
from sqlalchemy.orm import relationship
from .base import Base, BaseModel
import enum

class VMType(enum.Enum):
    KVM = "kvm"
    LXC = "lxc"

class VMStatus(enum.Enum):
    RUNNING = "running"
    STOPPED = "stopped"
    SUSPENDED = "suspended"
    FAILED = "failed"

class VirtualMachine(BaseModel):
    __tablename__ = "virtual_machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    vm_type = Column(Enum(VMType), nullable=False)
    status = Column(Enum(VMStatus), nullable=False, default=VMStatus.STOPPED)
    
    # Proxmox details
    proxmox_id = Column(Integer, nullable=False)
    proxmox_node = Column(String(100), nullable=False)
    
    # Resources
    cpu_cores = Column(Integer, default=1)
    memory_mb = Column(Integer, default=1024)  # in MB
    disk_size = Column(Integer, default=10)    # in GB
    
    # Network
    ip_address = Column(String(15))
    mac_address = Column(String(17))
    
    # Remote access
    rdp_enabled = Column(Boolean, default=True)
    ssh_enabled = Column(Boolean, default=True)
    ssh_port = Column(Integer, default=22)
    rdp_port = Column(Integer, default=3389)
    
    # Resource usage
    cpu_usage = Column(Float, default=0.0)     # percentage
    memory_usage = Column(Float, default=0.0)   # percentage
    disk_usage = Column(Float, default=0.0)     # percentage
    
    # Owner
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="virtual_machines")
    
    def __repr__(self):
        return f"<VirtualMachine {self.name} ({self.vm_type.value})>"

    def to_dict(self):
        """Convert to dictionary with additional computed fields."""
        base_dict = super().to_dict()
        base_dict.update({
            "owner_name": self.owner.username if self.owner else None,
            "resource_status": {
                "cpu": self.cpu_usage,
                "memory": self.memory_usage,
                "disk": self.disk_usage
            }
        })
        return base_dict