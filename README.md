# 📝 Notes App API (Express + MongoDB + JWT)

A secure Notes Management REST API built using **Node.js, Express, MongoDB, and JWT authentication**.  
Users can sign up, log in, and manage their personal notes (create, read, update, delete, pin, archive, etc).

---

## 🚀 Features

✅ User Authentication (JWT based)  
✅ Password hashing with **bcrypt**  
✅ Create / Read / Update / Delete (CRUD) Notes  
✅ Pin and Archive notes  
✅ Filter, search, and pagination support  
✅ Secure headers with **Helmet**  
✅ CORS enabled  
✅ Rate limiting for protection  
✅ Environment variables via **dotenv**  
✅ Centralized error handling


## Run the Server
npm run dev
Server starts at 👉 http://localhost:5000

## 📡API END POINTS

## 🧍Auth Routes
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login user
POST	/api/auth/refresh	Refresh access token
POST	/api/auth/logout	Logout user

## Header Required
Authorization: Bearer <accessToken>

## 🗒️Notes Routes
Method	Endpoint	Description
GET	/api/notes	Get all notes (supports search, tags, archived, pagination)
GET	/api/notes/:id	Get single note
POST	/api/notes	Create a new note
PUT	/api/notes/:id	Update a note
DELETE	/api/notes/:id	Delete a note
PATCH	/api/notes/:id/pin	Toggle pinned
PATCH	/api/notes/:id/archive	Toggle archived
GET	/api/notes/stats	Get user’s note statistics


## 🧪 Testing (Postman)

Use Postman to test all routes:

Set environment variables:

{{baseUrl}} = http://localhost:5000/api

{{accessToken}} = your JWT

Include header:
Authorization: Bearer {{accessToken}}


🧰 Tools & Dependencies
Package       	          Purpose
express	                  Web framework
mongoose                  MongoDB ODM
bcrypt	                  Password hashing
jsonwebtoken	            JWT auth
dotenv	                  Environment variables
express-validator       	Request validation
helmet	                  Security headers
cors	                    Cross-origin support
morgan	                  Request logging
express-rate-limit       	Rate limiting


## 🧑‍💻 Author

Shweta Singh
Backend Developer 🚀
