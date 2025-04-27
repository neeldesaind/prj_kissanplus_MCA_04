<h1 align="center">
🌾 Kissan Plus DM
</h1>

<p align="center">
<img src="https://img.shields.io/badge/Status-Active-black?style=for-the-badge" />
<img src="https://img.shields.io/badge/Backend-Node.js-black?style=for-the-badge&logo=node.js" />
<img src="https://img.shields.io/badge/Database-MongoDB-black?style=for-the-badge&logo=mongodb" />
<img src="https://img.shields.io/badge/Payment-Razorpay-black?style=for-the-badge&logo=razorpay" />
</p>

---

## 📚 Project Description

**Kissan Plus DM** is a Node.js-based backend system designed for managing farmer registrations, form submissions, bookings, and payments.  
It includes secure authentication, form management APIs, and online payment integration via Razorpay.  
Ideal for agricultural platforms, farmer portals, or any digital rural service systems.

---

## 🚀 Key Features

- 🌱 **Authentication**  
  - Secure login and registration
  - JWT-based session management
- 🗃️ **Form Management**  
  - Add, Update, Delete Farmer forms
- 📋 **Booking System**  
  - Book services/farm resources
- 💳 **Payment Gateway Integration**  
  - Razorpay-based payment API
- 👨‍💻 **Admin Management**  
  - Manage officers and farmers
- 👮 **Officer Management**  
  - Assigned roles to handle farmer data
- 📈 **Dashboard APIs**  
  - For Admins and Officers
- 🔒 **Security Features**  
  - Password hashing using bcrypt
  - Token expiration and middleware protection

---

## 🏗️ Project Architecture

```
/Kissan-plusDM
├── config/            # Database and Razorpay configuration
├── controllers/       # Business logic (authentication, form, payment)
├── middlewares/       # Authorization and error handlers
├── models/            # Mongoose schemas
├── routes/            # All API routes
├── utils/             # Helper functions
├── uploads/           # Uploaded files storage
├── .env               # Environment variables
├── app.js             # Express entry file
└── package.json       # Node dependencies
```

---

## 🔑 Environment Variables (`.env`)

You must create a `.env` file at the root with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

---

## ⚙️ Installation and Setup

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/Kissan-plusDM.git
cd Kissan-plusDM
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
cp .env.example .env
# Fill in your details
```

4. **Run the server**

```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## 📖 API Endpoints Overview

| Functionality | Method | Endpoint | Description |
|:--------------|:-------|:---------|:------------|
| Register Farmer | POST | `/api/v1/auth/register` | Register new farmer |
| Login | POST | `/api/v1/auth/login` | Farmer/Admin login |
| Create Form | POST | `/api/v1/form/create` | Create new farmer form |
| Update Form | PUT | `/api/v1/form/update/:id` | Update existing form |
| Delete Form | DELETE | `/api/v1/form/delete/:id` | Delete form |
| Booking | POST | `/api/v1/booking/create` | Create booking |
| Payment Order | POST | `/api/v1/payment/orders` | Create Razorpay order |
| Verify Payment | POST | `/api/v1/payment/verify` | Verify Razorpay payment |
| Admin: List Officers | GET | `/api/v1/admin/officers` | Fetch officer list |

_(More API details inside `/routes/` directory)_

---

## 🔥 Tech Stack

| Category | Technology |
|:---------|:------------|
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT Tokens |
| Payment | Razorpay API |
| File Upload | Multer |
| Password Encryption | bcryptjs |
| Hosting | (To be deployed) |

---

## 🧪 Testing the APIs

Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) to test the following:

- Register User
- Login
- Create and Update Forms
- Bookings and Payment APIs
- Admin Management

✅ Authentication Bearer Token required for most protected routes.

---

## 🛡️ Security Best Practices

- Passwords are hashed using **bcrypt** before saving
- JWTs expire after a limited time
- Admin and Officer roles are separated
- API validation and error handling built-in
- CORS configured for frontend communication

---

## 🚀 Future Improvements

- Add email notification on form submission/payment
- OTP based login
- Admin Dashboard UI (React.js frontend)
- User-friendly API documentation (Swagger UI)
- Dark Mode UI for frontend dashboard 🌑
- Integrate SMS alerts for farmers

---

## ✨ Screenshots (Optional)

_(You can add screenshots of your Postman tests or Admin dashboard when ready!)_

---

## 📞 Connect with Me

- GitHub: [YourGitHubProfile](https://github.com/yourusername)
- LinkedIn: [YourLinkedInProfile](https://linkedin.com/in/yourlinkedin)
- Email: yourmail@example.com

---

> Made with ❤️ for empowering Farmers and Digital India 🚀
