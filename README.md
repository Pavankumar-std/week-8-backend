A simple REST API built with Node.js, Express and MongoDB.

## Technologies
Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Helmet, CORS, express-rate-limit

## How to Run
1. Install Node.js and MongoDB (or use MongoDB Atlas).
2. Install packages:
   ```
   npm install
   ```
3. Copy `server/.env.example` to `server/.env` and set your values.
4. Start the server:
   ```
   npm start
   ```
   Server runs at `http://localhost:5000`.

## Folder Structure
```
server/
  config/        database connection
  controllers/   logic for each route
  models/        User, Job, Application
  routes/        API routes
  middleware/    auth, role, validation, error handling
  validators/    request validation
  utils/         helper functions
  server.js      app starts here
postman/         Postman collection
```

## Features
- Register / login with JWT, password hashing
- Roles: candidate, recruiter, admin
- Jobs CRUD with search, filters, sorting and pagination
- Applications: apply, view, update status, delete
- Centralized error handling and one response format

## Security Used
JWT authentication, password hashing (bcrypt), input validation, protected routes,
role-based authorization, environment variables, Helmet, CORS, rate limiting (100 requests / 15 min),
request size limit, MongoDB query protection, safe error messages.

## Testing
Import `postman/DG-Interns-Hub-API.json` in Postman and run the requests from top to bottom
(tokens and IDs are saved automatically).

See `API-DOCUMENTATION.md` for all endpoints.
