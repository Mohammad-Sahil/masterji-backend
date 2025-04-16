# MasterJi Backend (Node.js + Firebase)

This repository contains the backend code for **MasterJi**, a platform that manages consultant bookings, fabric shops, tailors, fashion consultants, orders, and more. It uses **Node.js**, **Firebase Cloud Functions**, **Firestore**, and **Firebase Storage**.

---

## 🔧 Features

- Complete CRUD operations for:
  - Consultant Booking
  - Fabric Shops
  - About Us
  - Customers
  - Executives
  - FAQs
  - Fashion Consultants
  - Garments
  - Messages
  - Orders
  - Queries
  - Roles
  - Tailors
  - Warehouses

- File handling with Firebase Storage
- Function hosting using Firebase Functions
- Twilio integration for SMS communication

---

## 📁 Project Structure

. ├── functions/
  ├── consultantBooking.js
  ├── fabricShops.js 
  ├── aboutus.js 
  ├── customers.js 
  ├── executives.js 
  ├── faqs.js 
  ├── fashionConsultant.js 
  ├── garments.js 
  ├── messages.js 
  ├── orders.js 
  ├── query.js 
  ├── roles.js 
  ├── tailors.js 
  ├── warehouses.js 
  ├── twilio.js 
  ├── index.js (main exports) 
  ├── env.json 
  ├── permissions.json │ └── ... 
  ├── .firebaserc 
  ├── firebase.json 
  ├── package.json 
  └── .gitignore

---

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js v18+
- Firebase CLI
- Firebase Project Setup

### Installation

```bash
git clone https://github.com/your-username/masterji-backend.git
cd masterji-backend/functions
npm install
```

## Firebase Setup
Run firebase login and authenticate.

Set your project: firebase use --add

Make sure your .firebaserc and firebase.json are configured.

## Deploy Functions
```bash
firebase deploy --only functions
```
##🛠️ Environment Config
Update the env.json file with your environment-specific settings like API keys, Twilio credentials, etc.

## 📦 Dependencies
firebase-admin
firebase-functions
twilio
dotenv
express

## 📲 Twilio Integration
Integrated via twilio.js
Used for sending SMS notifications (e.g., order status, OTP)

## 🔐 Permissions
All Firestore rules and permission settings are managed in permissions.json.

## 🤝 Contributing
Contributions are welcome! Open an issue or submit a pull request for improvements or bug fixes.

## 🧹 Notes
.DS_Store and other system files are ignored in .gitignore.
Image asset: MasterJi.png (used for branding or metadata).
ESLint is used for consistent code quality.
