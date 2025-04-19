from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine ,Column, DateTime
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from typing import Any
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql://user:password@localhost/lab_management"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Base model class with common fields
class BaseModel(Base):
    __abstract__ = True
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self) -> dict[str, Any]:
        """Convert model to dictionary."""
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }