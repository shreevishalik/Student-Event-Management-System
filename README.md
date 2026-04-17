# EventX: Enterprise-Grade Microservices Event Management System

**EventX** is a sophisticated, full-stack distributed system designed to manage campus events and student registrations. By utilizing a **Microservices Architecture**, the platform ensures high availability, service independence, and specialized data management across multiple MongoDB instances.

---

## 🏗️ System Architecture

The application is architected into four independent layers that communicate over HTTP/REST:

1.  **Identity & Access Management (IAM):** Handled by the **Auth Service** (Port 8080). It manages user credentials, role assignments (ADMIN/STUDENT), and issues signed **JWT** tokens for stateless session management.
2.  **Student Profile Microservice:** The **Student Service** (Port 8081) acts as the source of truth for academic data, including Roll Numbers, Departments, and Years of Study.
3.  **Event Orchestration Microservice:** The **Event Service** (Port 8083) manages the event lifecycle and handles the cross-service logic required to register a student from the Student Service into an event record.
4.  **Adaptive Frontend:** A **React + TypeScript** application that serves as a unified portal, dynamically rendering Admin or Student dashboards based on the decoded JWT payload.

---

## 🚀 Key Features

### **Administrative Power Tools**
* **Event Creation Suite:** Admins can define events with metadata including Title, Description, Date, Location, and Faculty ID.
* **Cross-Service Registration:** A specialized workflow allowing Admins to select a student (from Service A) and an event (from Service B) to create a registration record using a `POST` mapping.
* **Real-time Data Sync:** The UI utilizes `Promise.all` to fetch and synchronize data from multiple microservices simultaneously.

### **Student Self-Service**
* **Profile Management:** Students can submit and update their academic profiles, which are stored securely in a dedicated MongoDB collection.
* **Personalized Experience:** A streamlined UI focused on profile integrity and event visibility.

### **Security & Performance**
* **Stateless Authentication:** JWT-based security ensures the backend doesn't need to store session data, improving scalability.
* **CORS Policy:** Strict Cross-Origin Resource Sharing configurations to allow secure communication between the Vite-based frontend and Spring Boot backends.
* **Password Protection:** Industry-standard **BCrypt** hashing for all user passwords.

---

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Axios |
| **Backend Framework** | Spring Boot (Java 17) |
| **Security** | Spring Security 6, JWT (io.jsonwebtoken) |
| **Persistence** | MongoDB (NoSQL) |
| **Styling** | Modern CSS-in-JS (Object-based styling) |

---

## 🚦 Installation & Setup

### **1. Environment Prerequisites**
* **Java:** JDK 17 or higher.
* **Node.js:** Version 18.0 or higher.
* **Database:** MongoDB running locally on `localhost:27017` or a MongoDB Atlas Cloud connection string.

### **2. Backend Configuration**
In each service (`auth`, `student`, `event`), ensure the `src/main/resources/application.properties` is configured:
# Example for Event Service
server.port=8083
spring.data.mongodb.uri=mongodb://localhost:27017/event_db
# Ensure the Secret Key matches across all services for JWT validation
jwt.secret=YourSuperSecretKeyHere

### **3. Launching the Services**
Execute the following in separate terminal windows:
Auth Service: (Bash) cd backend/auth-service && mvn spring-boot:run
Student Service: (Bash) cd backend/student-service && mvn spring-boot:run
Event Service: (Bash) cd backend/event-service && mvn spring-boot:run

### **4. Frontend Deployment**
(Bash) cd frontend
npm install
npm run dev
The application will be accessible at http://localhost:5173.

## 📂 Project Structure

ip_mini/
├── backend/
│   ├── auth/            # Port 8080: User Auth & JWT
│   ├── student/         # Port 8081: Student Profiles
│   ├── event/           # Port 8083: Events & Registrations
│   └── faculty/         # Port 8082: Faculty microservice (optional)
├── frontend/
│   ├── src/
│   │   ├── App.tsx      # Central logic, Routing, & Global Styles
│   │   └── api/         # Axios interceptors & Base configurations
│   └── package.json     # React dependencies
├── .gitignore           # Global Master Ignore file
└── README.md            # Project Documentation

🔗 API Documentation Summary

| Service | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | User signup |
| **Auth** | `POST` | `/api/auth/login` | Returns JWT & User Role |
| **Student** | `POST` | `/api/students` | Save student profile details |
| **Event** | `POST` | `/api/events` | Create new event (Admin only) |
| **Event** | `POST` | `/api/events/{eId}/register/{sId}` | Register student to event |
