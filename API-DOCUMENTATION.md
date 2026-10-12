# API Documentation

Base URL: `http://localhost:5000`

**Response format**

Success: `{ "success": true, "message": "...", "data": {} }`
Error: `{ "success": false, "message": "..." }`

Protected routes need this header: `Authorization: Bearer <token>`

Roles: `candidate`, `recruiter`, `admin`

---

## Authentication

### POST /api/auth/register
- Purpose: Create a new account
- Authentication: No
- Body: `{ "name": "Asha", "email": "asha@example.com", "password": "password123", "role": "candidate" }` (role: candidate or recruiter, default candidate)
- Success (201): `{ "success": true, "message": "Registered successfully", "data": { "token": "JWT_TOKEN", "user": { "id": "...", "name": "Asha", "email": "asha@example.com", "role": "candidate" } } }`
- Error (400): `{ "success": false, "message": "Email is required" }`

### POST /api/auth/login
- Purpose: Login an existing user
- Authentication: No
- Body: `{ "email": "asha@example.com", "password": "password123" }`
- Success (200): `{ "success": true, "message": "Login successful", "data": { "token": "JWT_TOKEN", "user": {} } }`
- Error (401): `{ "success": false, "message": "Invalid email or password" }`

### GET /api/auth/me
- Purpose: Get the logged-in user
- Authentication: Yes (any role)
- Success (200): `{ "success": true, "message": "Current user", "data": { "_id": "...", "name": "...", "email": "...", "role": "..." } }`
- Error (401): `{ "success": false, "message": "Authentication required" }`

### POST /api/auth/logout
- Purpose: Logout (client deletes the token)
- Authentication: Yes
- Success (200): `{ "success": true, "message": "Logged out successfully", "data": {} }`
- Error (401): `{ "success": false, "message": "Authentication required" }`

---

## Users

### GET /api/users/profile
- Purpose: View own profile
- Authentication: Yes
- Success (200): `{ "success": true, "message": "Profile fetched", "data": {} }`
- Error (401): `{ "success": false, "message": "Authentication required" }`

### PUT /api/users/profile
- Purpose: Update own name or email
- Authentication: Yes
- Body: `{ "name": "New Name", "email": "new@example.com" }` (both optional)
- Success (200): `{ "success": true, "message": "Profile updated successfully", "data": {} }`
- Error (400): `{ "success": false, "message": "Already exists (duplicate value)" }`

### DELETE /api/users/profile
- Purpose: Delete own account
- Authentication: Yes
- Success (200): `{ "success": true, "message": "Account deleted successfully", "data": {} }`
- Error (401): `{ "success": false, "message": "Authentication required" }`

---

## Jobs

### GET /api/jobs
- Purpose: Get jobs with search, filters, sorting and pagination
- Authentication: No
- Query parameters:

| Parameter | Example | Meaning |
|---|---|---|
| search | `react` | Searches title, company, skills, location |
| type | `internship` or `job` | Filter by type |
| location | `remote` | Filter by location |
| skill | `javascript` | Filter by skill |
| sort | `newest`, `oldest`, `deadline` | Sorting (default newest) |
| page | `1` | Page number |
| limit | `10` | Items per page (max 50) |

- Example: `/api/jobs?type=internship&location=remote&skill=react&page=1&limit=10`
- Success (200): `{ "success": true, "message": "Jobs fetched successfully", "page": 1, "limit": 10, "total": 45, "totalPages": 5, "data": [] }`

### GET /api/jobs/:id
- Purpose: Get one job
- Authentication: No
- Success (200): `{ "success": true, "message": "Job fetched successfully", "data": {} }`
- Error (404): `{ "success": false, "message": "Job not found" }`

### POST /api/jobs
- Purpose: Create a job
- Authentication: Yes (recruiter, admin)
- Body: `{ "title": "React Intern", "company": "DG Tech", "description": "Build UI", "location": "Remote", "type": "internship", "skills": ["react", "javascript"], "deadline": "2026-12-31" }`
- Success (201): `{ "success": true, "message": "Job created successfully", "data": {} }`
- Error (400): `{ "success": false, "message": "Title is required" }`
- Error (403): `{ "success": false, "message": "You do not have permission to do this" }`

### PUT /api/jobs/:id
- Purpose: Update a job (only the recruiter who posted it, or admin)
- Authentication: Yes (recruiter, admin)
- Body: any job field, e.g. `{ "title": "New title" }`
- Success (200): `{ "success": true, "message": "Job updated successfully", "data": {} }`
- Error (403): `{ "success": false, "message": "You can only update your own jobs" }`

### DELETE /api/jobs/:id
- Purpose: Delete a job (only the recruiter who posted it, or admin)
- Authentication: Yes (recruiter, admin)
- Success (200): `{ "success": true, "message": "Job deleted successfully", "data": {} }`
- Error (404): `{ "success": false, "message": "Job not found" }`

---

## Applications

### POST /api/applications
- Purpose: Apply to a job
- Authentication: Yes (candidate)
- Body: `{ "jobId": "JOB_ID", "coverLetter": "I am interested" }`
- Success (201): `{ "success": true, "message": "Applied successfully", "data": {} }`
- Error (400): `{ "success": false, "message": "You have already applied for this job" }`

### GET /api/applications/my
- Purpose: View my applications
- Authentication: Yes (candidate)
- Success (200): `{ "success": true, "message": "Your applications", "data": [] }`
- Error (403): `{ "success": false, "message": "You do not have permission to do this" }`

### GET /api/applications/:id
- Purpose: View one application (candidate who applied, recruiter who owns the job, or admin)
- Authentication: Yes
- Success (200): `{ "success": true, "message": "Application fetched", "data": {} }`
- Error (404): `{ "success": false, "message": "Application not found" }`

### PUT /api/applications/:id/status
- Purpose: Change status (applied, shortlisted, selected, rejected)
- Authentication: Yes (recruiter who owns the job, admin)
- Body: `{ "status": "shortlisted" }`
- Success (200): `{ "success": true, "message": "Status updated successfully", "data": {} }`
- Error (400): `{ "success": false, "message": "Status must be applied, shortlisted, selected or rejected" }`

### DELETE /api/applications/:id
- Purpose: Delete an application (own application, or admin)
- Authentication: Yes (candidate, admin)
- Success (200): `{ "success": true, "message": "Application deleted successfully", "data": {} }`
- Error (403): `{ "success": false, "message": "You can only delete your own applications" }`

---

## Common Errors
| Status | Message |
|---|---|
| 401 | Authentication required / Invalid or expired token |
| 403 | You do not have permission to do this |
| 404 | Route not found / Resource not found |
| 429 | Too many requests, try again later |
| 500 | Something went wrong on the server |
