# ⚙️ Solo Plan Server — RESTful API & OAuth

This is the backend service powering the **Solo Plan** application. It handles user authentication (Local & Google OAuth), task management logic, and persistent storage using Node.js, Express, and MongoDB.

[**Frontend Repo**](https://github.com/DimaOliynyk/solo-plan) | [**Live Demo**](https://planer.dimaoliinyk.com)

---

## 🏗️ Architecture & Engineering

* **Hybrid Authentication:** Supports both traditional JWT-based registration/login and **Google OAuth 2.0** for a seamless user experience.
* **Security First:** Utilizes **Helmet** for setting secure HTTP headers, **CORS** for cross-origin resource sharing, and **Bcrypt** for password hashing.
* **Request Validation:** Implements schema-based validation to ensure all incoming data meets the required format before hitting the database.
* **Logging:** Integrated **Volleyball** for clear and concise HTTP request logging during development and production.

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/register` | Create a new user account | No |
| **POST** | `/login` | Authenticate user and receive JWT | No |
| **GET** | `/me` | Get current user profile data | **Yes** |
| **GET** | `/google` | Trigger Google OAuth flow | No |
| **GET** | `/google/callback` | Google OAuth callback handler | No |
| **GET** | `/info` | Check server status | No |

### 📝 Tasks Management (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/` | Retrieve all tasks for the authorized user | **Yes** |
| **POST** | `/` | Create a new task (includes date validation) | **Yes** |
| **PATCH** | `/:id/complete` | Toggle task completion status | **Yes** |
| **DELETE** | `/:id` | Remove a specific task | **Yes** |
| **GET** | `/ping` | Health check for the tasks router | No |

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (Mongoose) |
| **Auth** | Passport.js (JWT & Google Strategy) |
| **Security** | Helmet, CORS, Bcrypt |
| **Deployment** | Railway |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB** instance
* **Google Cloud Console** credentials (for OAuth)

### Installation & Environment

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/DimaOliynyk/solo-plan-server.git](https://github.com/DimaOliynyk/solo-plan-server.git)
    cd solo-plan-server
    ```

2.  **Setup Environment Variables:**
    Create a `.env` file and configure the following:
    ```env
    PORT=8080
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_super_secret_key
    GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=your_client_secret
    GOOGLE_CALLBACK_URL=[https://your-api-url.railway.app/api/auth/google/callback](https://your-api-url.railway.app/api/auth/google/callback)
    ```

3.  **Run the server:**
    ```bash
    npm install
    npm start
    ```

---

## 📝 License
Distributed under the MIT License.

## 🤝 Contact
**Dmytro Oliinyk**
* **GitHub:** [@DimaOliynyk](https://github.com/DimaOliynyk)
* **Website:** [dimaoliinyk.com](https://dimaoliinyk.com)
