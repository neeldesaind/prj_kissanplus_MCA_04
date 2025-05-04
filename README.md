# Kissan-Plus 🌾

**Kissan-Plus** is a full-stack application designed to support and empower farmers with tools and resources. It features a Vite-powered React frontend and a Node.js/Express backend.

---

## 📂 Project Structure

```

Kissan-Plus/
├── front-end/       # React + Vite frontend
└── back-end/        # Express backend API

````

---

## 🚀 Features

- 🌐 Frontend built with **React + Vite**
- ⚙️ Backend API powered by **Node.js + Express**
- 📦 Environment-based configuration using `.env`
- 🔒 Securely handles environment variables
- 📁 Organized `src/` directories for scalable development

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd Kissan-Plus
````

---

### 2. Backend Setup (`back-end`)

```bash
cd back-end
npm install
cp .env.sample .env
# Fill in .env with proper values
npm start
```

Server will typically run on `http://localhost:5000`.

---

### 3. Frontend Setup (`front-end`)

```bash
cd ../front-end
npm install
cp .env.sample .env
# Fill in .env with proper values
npm run dev
```

App runs by default on `http://localhost:5173`.

---

## 🧪 Development

* Code linting via ESLint (`eslint.config.js`)
* Environment configuration files (`.env`)
* Modular and maintainable structure in both frontend and backend

---

## 🤝 Contribution

(https://github.com/yash-b-patel)[Yash Patel]

---

## 📄 License

MIT License

---

## ✨ Acknowledgments

* [Vite](https://vitejs.dev/)
* [React](https://react.dev/)
* [Express](https://expressjs.com/)
