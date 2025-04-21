# Student Management System

A full-stack web application to manage students, courses, exams, and results with role-based access for admins and students.

## 🔧 Tech Stack

- **Frontend**: React (with Axios and plain CSS)
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: Cookie-based login with protected routes

## ✨ Features

- Role-based login system for Admin and Student users
- Admin functionalities:
  - Add, edit, and delete students
  - Create and manage courses, exams, and results
- Student functionalities:
  - View enrolled courses
  - View upcoming exams
  - Access personal exam results
- Secure API endpoints using cookie authentication

## 🗄️ Database Tables

- **`students`**:  
  `id`, `name`, `email`, `phone`, `dob`, `gender`, `city`, `file_path`, `password`, `role`

- **`courses`**:  
  `id`, `course_name`, `course_description`, `course_period`

- **`enrollments`**:  
  `id`, `student_id`, `course_id`

- **`exams`**:  
  `exam_id`, `course_id`, `exam_name`, `exam_date`, `exam_time`, `exam_type`

- **`results`**:  
  `id`, `student_id`, `exam_id`, `results`

## 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/IsuruWeerakoon/student-management-system.git
cd student-management-system
```

## 2. Database Setup
```
- import student_management_system.sql file to your database server
```

## 3. Backend Setup
```bash
cd backend
npm install
npm start
```
### Set up your MySQL database and connection in a .env file by editing the file in backend folder
```bash
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = 'Note : Change to your password'
DB_NAME = 'Note : Change to your database name'
DB_TIMEZONE = Z
```
## 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
>>>>>>> 457c7861de309482722613acc995ac1e96913874
