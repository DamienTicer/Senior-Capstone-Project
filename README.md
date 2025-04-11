# 🎓 Bowie State Tech Discount Recommendation System

This is a mock-up recommendation system developed as part of the Senior Capstone project at Bowie State University.  
It displays discounted tech products exclusively for Bowie students.

---

## 🚀 Features
- Bowie student email authentication
- Product recommendation display with discounted prices
- Dynamic product slider UI with images and details
- Mock product data using MySQL
- Local server and database setup
- Automatic database initialization on start (for development/demo)

---

## 🗂️ Project Structure
```
Senior-Capstone-Project/
├── backend/
│   ├── app.js
│   ├── initDB.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── img/
│       ├── iPhone16Promax2.jpg
│       ├── MacbookAir2024_2.jpg
│       ├── MicrosoftSurface2024_2.jpg
│       ├── iPad10thGen2.jpg
│       └── AppleWatchSeries10_2.jpg
├── .gitignore
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

### 3. Install Concurrently for Root Project
```bash
npm install concurrently --save-dev
```

### 4. Configure Database Access
In `backend/initDB.js` and `backend/app.js`, update the following with your local MySQL password:
```js
password: 'Password1234'
```

### 5. Prepare Image Assets
Ensure all product images are placed in:
```
frontend/img/
```

### 6. Run the Project
From the project root folder:
```bash
npm start
```
This will:
✅ Initialize the database automatically (if needed)  
✅ Start the backend server at `http://localhost:3000`  
✅ Open the frontend website in your browser with dynamic product slider

---

## 📌 Notes
- This version uses **mock data only**.
- No real API integration.
- Intended for local demonstration purposes.
- Database is automatically re-initialized every time you run `npm start`. **All data will reset.**

---

## 👥 Team Members
- Damien Ticer
- Bethelihem Berihun
- Anh Phan
- Jared Robinson

---