### README for the Application

#### Application Description

This application is a system for managing work sessions, projects, and users. Users can start and stop work sessions associated with projects. Additionally, the application offers functionality to view the total work time of users, either for an individual user or for all users in the system.

---

### Technologies

- **Backend**: NestJS (Node.js Framework)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Token)
- **Testing**: Jest, Supertest
- **Swagger**: API Documentation
- **Role Management**: Guards, Decorators

---

### Requirements

1. **Node.js** (version 16 or higher)
2. **PostgreSQL** (or any database compatible with TypeORM)
3. **NestJS CLI** (optional, if you want to generate new modules, controllers, services, etc.)

---

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure the `.env` file**:
   Create a `.env` file in the root of the project and fill in the following data:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword
   DB_DATABASE=yourdatabase
   JWT_SECRET=yourjwtsecret
   JWT_EXPIRATION=3600
   ```

   *The above environment variables are required for the application to work correctly, including connecting to the database and generating JWT tokens.*

4. **Build and run the application**:

   If the database is not created yet, run the following command to set it up:

   ```bash
   npm run typeorm migration:run
   ```

   Start the application in development mode:

   ```bash
   npm run start:dev
   ```

   After running, the application will be available at `http://localhost:3000`.

---

### Project Structure

- **src/**: Main source folder
  - **auth/**: Authentication logic (JWT, Guards, Roles)
  - **user/**: User module (registration, login)
  - **project/**: Project management module
  - **work-session/**: Work session management module
  - **common/**: Common functions, such as role decorators

- **test/**: Contains unit and integration tests for the application

---

### Endpoints

#### User Registration

- **POST** `/users/register`
  
  - **Description**: Registers a new user.
  - **Request Body**: `email`, `password`
  - **Response**: Returns a confirmation link for the user's email.

#### User Login

- **POST** `/users/login`
  
  - **Description**: Logs in a user and returns a JWT token.
  - **Request Body**: `email`, `password`
  - **Response**: Returns a JWT token.

#### Email Confirmation

- **GET** `/users/confirm?email=email@example.com`
  
  - **Description**: Confirms the user's email.

#### Create Project

- **POST** `/projects`
  
  - **Description**: Creates a new project.
  - **Request Body**: `name`
  - **Response**: Returns information about the created project.

#### Get Projects

- **GET** `/projects`
  
  - **Description**: Retrieves a list of projects with pagination and sorting.
  - **Query Parameters**: `page`, `limit`, `sortBy`, `sortOrder`
  - **Response**: Returns a list of projects.

#### Start Work Session

- **POST** `/work-session/start`
  
  - **Description**: Starts a new work session.
  - **Request Body**: `description`, `projectId`
  - **Response**: Returns information about the started work session.

#### Stop Work Session

- **POST** `/work-session/stop`
  
  - **Description**: Stops an existing work session.
  - **Request Body**: `sessionId`
  - **Response**: Returns information about the stopped work session.

#### Get Total Work Time for User

- **GET** `/work-session/total-time`
  
  - **Description**: Returns the total work time for a user.
  - **Query Parameter**: `userId`
  - **Response**: Returns a summary of the user's work time.

#### Get Total Work Time for All Users (Admin Only)
- **GET** /work-session/total-time-all-users

**Description**: Fetches the total work time for all users. Optionally, the result can be filtered by a specific user using the userId query parameter. This endpoint is restricted to admin users only.

**Query Parameter**: userId (optional) - Filters by user ID. If not provided, it returns work time summaries for all users.

**Response**: Returns a list of work time summaries for all users, with daily breakdowns of work hours.
---

### Roles and Permissions

- **Roles**: The system supports different roles (e.g., `Admin`, `User`).
  - **Admin**: Has access to all features, including creating and editing projects.
  - **User**: Can only manage their own work sessions.

- **Guards**:
  - **JwtAuthGuard**: Checks the validity of the JWT token in the authorization header.
  - **RolesGuard**: Ensures that the user has the correct role to perform a specific action.

---

### Testing

Unit tests are written using **Jest**. To run the tests:

```bash
npm run test
```

To run the full tests (including database integration):

```bash
npm run test:e2e
```

Tests are located in the `src` folder within the respective modules.
