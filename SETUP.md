add # Proxmox Portal Setup Guide

This guide will help you set up and run the Proxmox Portal application.

## Prerequisites

Before starting, ensure you have the following installed:
- Python 3.8 or higher
- Node.js and npm
- MySQL database server
- Proxmox server
- Docker and Docker Compose (optional)

## Project Structure

```
proxmox-portal/
├── backend/         # FastAPI backend
├── frontend/        # React frontend
├── docker/         # Docker configuration
└── docs/           # Documentation
```

## Step-by-Step Setup

### 1. Clone and Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd proxmox-portal

# Create git repository (if not already done)
git init
git add .
git commit -m "Initial commit"
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

Edit `.env` file with your settings:
```ini
# Database Configuration
DATABASE_URL=mysql://user:password@localhost:3306/lab_management

# JWT Configuration
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Proxmox Configuration
PROXMOX_HOST=your-proxmox-host
PROXMOX_USER=root@pam
PROXMOX_PASSWORD=your-proxmox-password

# Server Configuration
HOST=localhost
PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```

Initialize the database:
```bash
# Run database migrations
alembic upgrade head
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit frontend `.env` file:
```ini
REACT_APP_API_URL=http://localhost:8000
```

### 4. Running the Application

#### Development Mode

Backend:
```bash
# From backend directory
uvicorn app.main:app --reload --port 8000
```

Frontend:
```bash
# From frontend directory
npm start
```

#### Using Docker (Optional)

```bash
# Start all services
docker-compose up -d
```

### 5. Accessing the Application

Once running, you can access:
- Frontend Application: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Database Management

### Creating New Migrations

When you make changes to database models:
```bash
cd backend
alembic revision -m "description_of_changes"
```

### Applying Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Apply next migration
alembic upgrade +1

# Rollback one migration
alembic downgrade -1

# Rollback all migrations
alembic downgrade base
```

## Troubleshooting

1. Database Connection Issues:
   - Verify MySQL is running
   - Check database credentials in .env
   - Ensure database exists

2. Proxmox Connection:
   - Verify Proxmox server is accessible
   - Check Proxmox credentials in .env
   - Enable API access in Proxmox

3. Frontend API Connection:
   - Verify backend is running
   - Check REACT_APP_API_URL in frontend .env
   - Ensure CORS settings are correct

## Additional Notes

- Default admin user will be created on first run
- Frontend runs on Node.js development server in development mode
- Backend uses uvicorn server with hot-reload in development
- Docker setup includes all necessary services

For more detailed information, check:
- [API Documentation](http://localhost:8000/docs)
- [Project Documentation](./docs/)