# 💸 Personal Finance Assistant

**Personal Finance Assistant** is a full-stack finance management web application that empowers users to track, manage, and analyze their financial transactions. From manual entries to receipt-based extraction and insightful analytics, the app streamlines personal budgeting with a modern, intuitive UI.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [APIs](#-apis)
- [How It Works](#-how-it-works)
- [Receipt & PDF Data Extraction](#-receipt--pdf-data-extraction)
- [Setup Instructions](#-setup-instructions)
- [Bonus Implementations](#-bonus-implementations)
- [Code Quality](#-code-quality-guidelines)

---

## 📹 Demo Video

👉 [Click here to watch the demo](https://drive.google.com/file/d/1XfPXFBKfdDzWRgcrFYyhNX9A4bT3gYvJ/view?usp=sharing)

Or preview below:

![Demo](https://drive.google.com/file/d/1XfPXFBKfdDzWRgcrFYyhNX9A4bT3gYvJ/view?usp=sharing)


## ✅ Features

### 🔹 Core Features
- ➕ Add income/expense entries manually via web app
- 📆 Filter and list all income/expenses in a time range
- 📊 View analytics with graphs:
  - Expenses by category
  - Expense trends over time
- 📸 Extract transactions from uploaded POS receipts (images or PDFs)

### 🏆 Bonus Features
- 📥 Bulk transaction import via bank statement PDFs (tabular format)
- 🧾 Receipt OCR using Tesseract.js
- 📄 PDF parsing using `pdf-parse`
- 👥 Multi-user authentication 
- 📃 Pagination for transactions list

---

## 🛠️ Tech Stack

### 🔷 Frontend
- React.js (UI library)
- React Router DOM (routing)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Chart.js + React-chartjs-2 (visualizations)

### 🔶 Backend
- Node.js + Express.js
- PostgreSQL (hosted via Neon.tech)
- Multer (file uploads)
- Tesseract.js (OCR from images)
- `pdf-parse` (text extraction from PDFs)
- JWT (authentication)
- Bcrypt (password hashing)
- CORS, Helmet, dotenv

---

## 🗂️ Project Structure (Simplified)

client/
├── pages/ (Login, Register, Dashboard)
├── components/
├── PdfBulkUploader.jsx
├── ReceiptUploader.jsx
├── TransactionsList.jsx
├── Analytics.jsx
├── context/AuthContext.js
├── App.js

server/
├── controllers/
├── authController.js
├── transactionController.js
├── pdfController.js
├── routes/
├── authRoutes.js
├── transactionRoutes.js
├── uploadRoutes.js
├── utils/
├── receiptParser.js
├── pdfParser.js
├── middleware/
├── authMiddleware.js
├── models/
├── User.js
├── Transaction.js


---

## 🔌 APIs

### 🧾 Receipt Upload
- `POST /api/upload-receipt` → Extract transactions from image (via Tesseract.js)

### 📄 PDF Upload
- `POST /api/upload-pdf-transactions` → Extract tabular data using `pdf-parse`

### 📊 Transactions
- `POST /api/transactions` → Create a new transaction
- `GET /api/transactions?from=&to=` → List transactions by date range (supports pagination)
- `GET /api/analytics` → Returns category-wise or date-wise analysis

### 👤 Authentication
- `POST /api/register` → Register new user
- `POST /api/login` → Login and get JWT

---

## 🔁 How the Flow Works

1. **User Authenticates**:
   - JWT is stored and used for protected endpoints.

2. **Manual Transaction Entry**:
   - User adds income/expenses via a form.

3. **Receipts Upload**:
   - POS images processed with `Tesseract.js` → text → parsed → structured into transaction JSON → saved to DB.

4. **PDF Upload**:
   - Bank statement or PDF receipt parsed using `pdf-parse` → tabular rows extracted → saved to DB.

5. **Transactions List**:
   - Filtered by date range or user; supports pagination.

6. **Analytics Page**:
   - Charts built with Chart.js, showing breakdowns and trends.

---

## 🧠 Receipt & PDF Extraction Logic

### 📸 Receipt (Image)
- Library: `tesseract.js`
- Flow: Image → OCR → Raw text → Regex/parser → `{ amount, category, date, description }`

### 📄 PDF (Bank Statement)
- Library: `pdf-parse`
- Flow: PDF → Extracted text → Tabular lines split → JSON conversion → DB insert

Example output:
```json
{
  "amount": 100,
  "description": "Coffee Shop",
  "category": "Food",
  "date": "2024-01-15"
}


Setup Instructions
Clone the repository

git clone https://github.com/monika2402/finmate.git
cd finmate
Install client dependencies

cd client
npm install
npm run dev


Install server dependencies

cd ../server
npm install
npm run dev


Setup .env

PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_tNrlZ67LDbTz@ep-purple-morning-a86oxr0z-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=finmate_secret_key

Summary
This project demonstrates how modern web applications can blend data extraction, financial management, and user analytics into a unified experience. Whether uploading a receipt or exploring expenses visually, Personal Finance Assistant delivers clarity and control over finances.