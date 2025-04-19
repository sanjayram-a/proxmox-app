"""initial migration

Revision ID: 001
Revises: 
Create Date: 2025-04-17 23:12:32.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(50), nullable=False),
        sa.Column('email', sa.String(100), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(100), nullable=True),
        sa.Column('role', sa.Enum('STUDENT', 'TEACHER', 'ADMIN', name='userrole'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username'),
        sa.UniqueConstraint('email')
    )

    # Create virtual_machines table
    op.create_table(
        'virtual_machines',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('vm_type', sa.Enum('KVM', 'LXC', name='vmtype'), nullable=False),
        sa.Column('status', sa.Enum('RUNNING', 'STOPPED', 'SUSPENDED', 'FAILED', name='vmstatus'), nullable=False),
        sa.Column('proxmox_id', sa.Integer(), nullable=False),
        sa.Column('proxmox_node', sa.String(100), nullable=False),
        sa.Column('cpu_cores', sa.Integer(), nullable=False, default=1),
        sa.Column('memory_mb', sa.Integer(), nullable=False, default=1024),
        sa.Column('disk_size', sa.Integer(), nullable=False, default=10),
        sa.Column('ip_address', sa.String(15), nullable=True),
        sa.Column('mac_address', sa.String(17), nullable=True),
        sa.Column('rdp_enabled', sa.Boolean(), nullable=False, default=True),
        sa.Column('ssh_enabled', sa.Boolean(), nullable=False, default=True),
        sa.Column('ssh_port', sa.Integer(), nullable=True, default=22),
        sa.Column('rdp_port', sa.Integer(), nullable=True, default=3389),
        sa.Column('cpu_usage', sa.Float(), nullable=False, default=0.0),
        sa.Column('memory_usage', sa.Float(), nullable=False, default=0.0),
        sa.Column('disk_usage', sa.Float(), nullable=False, default=0.0),
        sa.Column('owner_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('ix_virtual_machines_owner_id', 'virtual_machines', ['owner_id'])
    op.create_index('ix_users_username', 'users', ['username'])
    op.create_index('ix_users_email', 'users', ['email'])


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('virtual_machines')
    op.drop_table('users')