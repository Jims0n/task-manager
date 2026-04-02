# Task Manager

A full-stack task management application with JWT authentication, built with Django REST Framework and React TypeScript.

## Features

### User Authentication
- User registration with email and password
- JWT-based login with access and refresh tokens
- Protected routes - only authenticated users can access tasks
- Logout with token invalidation

### Task Management (CRUD)
- Create tasks with title, description, due date, priority, and status
- View all tasks with filtering by status and priority
- Update tasks (full or partial updates)
- Delete tasks
- Users can only access their own tasks (no cross-user data leakage)

### Security
- Passwords are hashed using Django's built-in authentication
- JWT tokens are signed and validated
- Input validation and error handling on all endpoints

## Tech Stack

### Backend
- **Python 3.9+**
- **Django 4.2** - Web framework
- **Django REST Framework** - API development
- **Simple JWT** - JWT authentication
- **PostgreSQL** - Database
- **drf-spectacular** - API documentation

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors

## Project Structure

```
task-manager/
├── backend/
│   ├── taskmanager/          # Django project settings
│   ├── accounts/             # User authentication app
│   │   ├── models.py         # Custom User model
│   │   ├── serializers.py    # Auth serializers
│   │   ├── views.py          # Register, logout, profile views
│   │   └── urls.py           # Auth endpoints
│   ├── tasks/                # Task management app
│   │   ├── models.py         # Task model
│   │   ├── serializers.py    # Task serializer
│   │   ├── views.py          # Task ViewSet
│   │   └── urls.py           # Task endpoints
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance and API services
│   │   ├── context/          # Auth context provider
│   │   ├── pages/            # Login, Register, Dashboard
│   │   ├── components/       # Reusable components
│   │   ├── types/            # TypeScript interfaces
│   │   └── App.tsx           # Main app with routing
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and get JWT tokens |
| POST | `/api/auth/logout/` | Logout (blacklist refresh token) |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/PUT | `/api/auth/profile/` | Get or update user profile |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List all tasks (supports `?status=` and `?priority=` filters) |
| POST | `/api/tasks/` | Create a new task |
| GET | `/api/tasks/{id}/` | Get a specific task |
| PUT | `/api/tasks/{id}/` | Full update of a task |
| PATCH | `/api/tasks/{id}/` | Partial update of a task |
| DELETE | `/api/tasks/{id}/` | Delete a task |

### Documentation
- **Swagger UI**: `/api/docs/`
- **ReDoc**: `/api/redoc/`
- **OpenAPI Schema**: `/api/schema/`

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your configuration:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   DB_NAME=taskmanager
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_HOST=localhost
   DB_PORT=5432
   ```

6. Create the PostgreSQL database:
   ```bash
   psql -U postgres -c "CREATE DATABASE taskmanager;"
   ```

7. Run migrations:
   ```bash
   python manage.py migrate
   ```

8. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Register a new account or login with existing credentials
3. Create, view, edit, and delete tasks from the dashboard
4. Use filters to view tasks by status or priority
5. Update task status directly from the task card

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| DEBUG | Enable debug mode (True/False) |
| SECRET_KEY | Django secret key (min 50 chars recommended) |
| DB_NAME | PostgreSQL database name |
| DB_USER | PostgreSQL username |
| DB_PASSWORD | PostgreSQL password |
| DB_HOST | Database host (default: localhost) |
| DB_PORT | Database port (default: 5432) |


