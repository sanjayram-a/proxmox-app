from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from .routers import auth, virtual_machine
from .database import init_db

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Lab Management System",
    description="API for managing virtual machines and containers in a lab environment",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(virtual_machine.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()

@app.get("/")
async def root():
    """Root endpoint."""
    return JSONResponse({
        "status": "success",
        "message": "Lab Management System API is running",
        "version": "1.0.0"
    })

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return JSONResponse({
        "status": "healthy",
        "components": {
            "api": "up",
            "database": "up",
            "proxmox": "up"
        }
    })

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug
    )