# StartupFund B2B SaaS Ecosystem

A premium, secure B2B SaaS platform inspired by **ElevenLabs** aesthetics, designed for startups, professional investors, MNCs, and enterprise entities to connect, collaborate, and capitalize on innovation.

## 🚀 Key Features

- **ElevenLabs-Inspired UI**: Premium, high-contrast, modular design system built with `styled-components` and `framer-motion`.
- **Ecosystem Roles**: Dedicated workflows for Startups, Investors, MNCs, and Single Employees.
- **Private Collaboration Space**: Secure messaging and document sharing environment for professional entities.
- **Campaign Marketplace**: Advanced startup funding marketplace with project locking mechanisms and equity tracking.
- **Compliance Terminal**: Executive audit dashboard for managing KYC (Identity/Address), fraud reports, and bug submissions.
- **Enterprise Storage**: Integrated Firebase Storage for secure document management and compliance auditing.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Styled Components, Framer Motion, Zustand, Axios, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT (Custom), Helmet, Express Rate Limit.
- **Services**: Firebase (Storage & Auth), Razorpay (Payments).
- **Deployment**: Vercel (Frontend), Render (Backend).

## 📦 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Firebase project credentials
- Razorpay API keys

### Backend Setup
1. `cd project/backend`
2. `npm install`
3. Create `.env` file with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```
4. `npm run dev`

### Frontend Setup
1. `cd project/frontend`
2. `npm install`
3. Create `.env` file with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
4. `npm run dev`

## 🛡 Security & Compliance

- **ISO 27001 Inspired Protocols**: Data isolation per professional entity.
- **Automated Auditing**: Node-cron jobs for campaign status management.
- **Identity Verification**: Multi-stage KYC audit via the Executive Terminal.

---
&copy; 2026 StartupFund B2B SaaS Ecosystem. All rights reserved.
