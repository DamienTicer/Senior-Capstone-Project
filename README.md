# 🎓 Bowie State Tech Discount Recommendation System

This is a mock-up recommendation system developed as part of the Senior Capstone project at Bowie State University. It displays discounted tech products exclusively for Bowie students.

---

## 🚀 Features
- Bowie student email authentication (email must end in @students.bowiestate.edu)
- Product display using structured mock data
- Dynamic user interface with product cards, school branding, and mock API integration
- Local server and MySQL database setup
- Automatic database initialization on server start (for development/demo)
- Frontend and backend run together via single `npm start`

---

## 🗂️ Project Structure
```
Senior-Capstone-Project/
├── backend/
│   ├── app.js
│   ├── initDB.js
│   ├── route/
│   │   └── mock-products.js
│   ├── utils/
│   │   └── (optional helpers)
│   ├── package.json
├── frontend/
│   ├── index.html
│   ├── main.js
│   ├── API.js
│   ├── style.css
│   ├── mockAPI.json
│   └── img/
│       ├── iPhone16Promax2.jpg
│       ├── MacbookAir2024_2.jpg
│       ├── MicrosoftSurface2024_2.jpg
│       ├── iPad10thGen2.jpg
│       ├── AppleWatchSeries10_2.jpg
│       └── (other icons like facebook.png, etc.)
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Senior-Capstone-Project.git
cd Senior-Capstone-Project
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Install Root Project Dependencies
```bash
npm install concurrently serve open-cli --save-dev
```

### 4. Configure MySQL Database Access
In `backend/initDB.js`, update the following with your local MySQL password:
```js
password: 'Password1234'
```

Ensure your MySQL server is running and you have permissions to create a database.

### 5. Prepare Image Assets
Ensure all product and social media images are placed in:
```
frontend/img/
```

### 6. Run the Project
From the root project folder:
```bash
npm start
```
This will:
- ✅ Automatically initialize/reset the database with sample users and products
- ✅ Start the backend server at `http://localhost:3000`
- ✅ Serve the frontend at `http://localhost:5500`
- ✅ Open the website in your default browser

---

## 📌 Notes
- This project uses a **mock API (`mockAPI.json`)** instead of a real external API like Amazon.
- The mock API is used to simulate a real-world backend response for the frontend to render.
- No actual login validation or persistent user data is stored — it is for demonstration only.
- The MySQL database is re-initialized every time the server starts.

---

## 👥 Team Members
- Damien Ticer
- Bethelihem Berihun
- Anh Phan
- Jared Robinson