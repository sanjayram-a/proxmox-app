# Proxmox Virtual Lab Management System

A full-stack application for managing virtual machines in a Proxmox environment, with a React frontend and FastAPI backend.

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/sanjayram-a/proxmox-app
cd proxmox-app
```

2. **Start the backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. **Start the frontend**
```bash
cd frontend
npm install
npm start
```

4. Visit http://localhost:3000 to access the application

## Documentation

Detailed documentation is available in the [docs](./docs) directory:

- [Complete Workflows](./docs/workflows.md) - Sequence diagrams of key system processes
- [Setup Guide](./SETUP.md) - Detailed installation and configuration instructions
- [Project Guide](./docs/README.md) - Development guidelines and detailed setup instructions

## Project Architecture

### Backend (FastAPI)
- **Language**: Python
- **Framework**: FastAPI
- **Database**: MySQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT

Directory Structure:
```
backend/
├── app/
│   ├── models/         # Database models
│   ├── routers/        # API routes
│   ├── schemas/        # Pydantic schemas
│   └── services/       # Business logic
├── alembic/            # Database migrations
└── requirements.txt    # Python dependencies
```

### Frontend (React)
- **Language**: TypeScript
- **Framework**: React
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI

Directory Structure:
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Main application pages
│   ├── services/      # API service layer
│   ├── store/         # Redux store and slices
│   └── types/         # TypeScript type definitions
```

## Features

- User authentication and authorization
- Virtual machine management
- Resource monitoring
- Remote console access
- Role-based access control

## Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL 8.0+
- Proxmox VE server
- Apache Guacamole server (for remote console)

## Environment Setup

### Backend (.env)
```
DATABASE_URL=mysql://user:password@localhost:3306/lab_management
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
PROXMOX_HOST=your-proxmox-host
PROXMOX_USER=root@pam
PROXMOX_PASSWORD=your-proxmox-password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## Development Workflow

1. Create a new feature branch from main
2. Make your changes following the [development guidelines](./docs/README.md)
3. Write/update tests as needed
4. Submit a pull request for review

## Contributing

Please read our [Contributing Guide](./docs/README.md) for details on our development process and coding standards.

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the LICENSE file for details.

## Support

For support, please open an issue in the project repository or contact the development team.
