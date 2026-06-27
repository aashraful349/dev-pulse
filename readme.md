# DevPulse

DevPulse is an internal tech issue and feature tracker built with Node.js, TypeScript, Express, PostgreSQL, and raw SQL. It allows team members to register, log in, create issues, view reported work, and manage issue updates based on their role.

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization
- Contributor and maintainer permissions
- Create bug reports and feature requests
- View all issues with reporter details
- View a single issue
- Update issue details
- Maintainer-only issue deletion
- PostgreSQL schema initialization on server startup

## Tech Stack

| Technology | Usage |
| --- | ---|
| Node.js(LTS) | Runtime|
| TypeScript | Language |
| Express.js | Web Framework |
| PostgreSQL | Database |
| Native `pg` driver | Raw sql queries with `pool.query()` |
| `bcryptjs` | for password hashing |
| `jsonwebtoken` | for JWT authentication |
| `dotenv` | for environment configuration |
| `cors` | for cross-origin requests |




## Project Structure
```
├── package.json
├── package-lock.json
├── readme.md
├── src
│   ├── app.ts
│   ├── config
│   │   └── index.ts
│   ├── db
│   │   └── index.ts
│   ├── middleware
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   └── index.d.ts
│   ├── modules
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.services.ts
│   │   └── issue
│   │       ├── issue.controller.ts
│   │       ├── issue.route.ts
│   │       └── issue.services.ts
│   ├── server.ts
│   ├── types
│   │   └── index.ts
│   └── utility
│       └── index.ts
└── tsconfig.json
```

## Getting Started

### 1. Clone The Repository

```bash
git clone <repository-url>
cd dev-pulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
CONNECTIONSTRING=postgresql://username:password@localhost:5432/devpulse
JWT_SECRET=your_jwt_secret
```

Environment variables:

| Variable | Description |
| --- | --- |
| `PORT` | Port where the Express server will run |
| `CONNECTIONSTRING` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |

### 4. Run The Server

```bash
npm run dev
```

The server initializes the required database tables automatically and starts on the configured port.

Default base URL:

```text
http://localhost:5000
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the development server with `tsx watch` |
| `npm test` | Placeholder test script |

## API Endpoints

### Health Check

```http
GET /
```

Response:

```text
Welcome to Dev-Pulse
```

## Authentication

### Register User

```http
POST /api/auth/signup
```

Access: Public

Request body:

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

Notes:

- `role` is optional.
- If `role` is not provided, it defaults to `contributor`.
- Allowed roles are `contributor` and `maintainer`.
- Passwords are hashed before being stored.

Success response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00.000Z",
    "updated_at": "2026-01-20T09:00:00.000Z"
  }
}
```

### Login User

```http
POST /api/auth/login
```

Access: Public

Request body:

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00.000Z",
      "updated_at": "2026-01-20T09:00:00.000Z"
    }
  }
}
```

## Issues

For protected issue endpoints, send the JWT token in the `Authorization` header:

```http
Authorization: <JWT_TOKEN>
```

### Create Issue

```http
POST /api/issues
```

Access: Authenticated contributors and maintainers

Request body:

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

Allowed issue types:

- `bug`
- `feature_request`

Success response:

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00.000Z",
    "updated_at": "2026-01-20T10:30:00.000Z"
  }
}
```

### Get All Issues

```http
GET /api/issues
```

Access: Public

Optional query parameters:

| Parameter | Allowed Values | Description |
| --- | --- | --- |
| `sort` | `newest`, `oldest` | Sort issues by creation time |
| `type` | `bug`, `feature_request` | Filter by issue type |
| `status` | `open`, `in_progress`, `resolved` | Filter by workflow status |

Example:

```http
GET /api/issues?sort=newest&type=bug&status=open
```

Success response:

```json
{
  "success": true,
  "message": "Issues retrieved successfully",
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00.000Z",
      "updated_at": "2026-01-20T10:30:00.000Z"
    }
  ]
}
```

### Get Single Issue

```http
GET /api/issues/:id
```

Access: Public

Success response:

```json
{
  "success": true,
  "message": "Issue retrieved successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00.000Z",
    "updated_at": "2026-01-20T10:30:00.000Z"
  }
}
```

### Update Issue

```http
PATCH /api/issues/:id
```

Access:

- Maintainers can update any issue.
- Contributors can update their own issue only when the issue status is `open`.

Request body:

```json
{
  "title": "Updated: Database pool exhaustion fix needed",
  "description": "Updated description with reproduction steps...",
  "type": "bug"
}
```

Maintainers may also update the issue status with one of:

- `open`
- `in_progress`
- `resolved`

Success response:

```json
{
  "success": true,
  "message": "Issue updated successfully",
  "data": {
    "id": 45,
    "title": "Updated: Database pool exhaustion fix needed",
    "description": "Updated description with reproduction steps...",
    "type": "bug",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00.000Z",
    "updated_at": "2026-01-20T14:45:00.000Z"
  }
}
```

### Delete Issue

```http
DELETE /api/issues/:id
```

Access: Maintainer only

Success response:

```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

## Roles And Permissions

| Role | Permissions |
| --- | --- |
| `contributor` | Register, log in, create issues, view issues, update own open issues |
| `maintainer` | All contributor permissions, update any issue, update workflow status, delete any issue |

## Database Schema

The application creates the following tables automatically on startup.

### users

| Column | Type / Constraint |
| --- | --- |
| `id` | `SERIAL PRIMARY KEY` |
| `name` | `VARCHAR(30) NOT NULL` |
| `email` | `VARCHAR(50) NOT NULL UNIQUE` |
| `password` | `TEXT NOT NULL` |
| `role` | `VARCHAR(20) NOT NULL DEFAULT 'contributor'` |
| `created_at` | `TIMESTAMP DEFAULT NOW()` |
| `updated_at` | `TIMESTAMP DEFAULT NOW()` |

Allowed roles:

- `contributor`
- `maintainer`

### issues

| Column | Type / Constraint |
| --- | --- |
| `id` | `SERIAL PRIMARY KEY` |
| `title` | `VARCHAR(150) NOT NULL` |
| `description` | `TEXT NOT NULL CHECK(LENGTH(description) >= 20)` |
| `type` | `VARCHAR(20) NOT NULL` |
| `status` | `VARCHAR(20) NOT NULL DEFAULT 'open'` |
| `reporter_id` | `INT NOT NULL REFERENCES users(id) ON DELETE CASCADE` |
| `created_at` | `TIMESTAMP DEFAULT NOW()` |
| `updated_at` | `TIMESTAMP DEFAULT NOW()` |

Allowed issue types:

- `bug`
- `feature_request`

Allowed statuses:

- `open`
- `in_progress`
- `resolved`

## Response Format

Success response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message",
  "error": {}
}
```

## Notes

- The project uses raw SQL only.
- Reporter details are loaded separately without SQL joins.
- Protected routes require a valid JWT token in the `Authorization` header.
- Passwords are not returned from signup or login responses.
