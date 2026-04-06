# Salesforce Validation Rule Manager

A React-based web application to manage Salesforce Validation Rules using OAuth 2.0 and Salesforce Tooling API.

---

## 🚀 Features

- Login with Salesforce using OAuth 2.0
- Fetch all validation rules from Salesforce
- Display validation rules with active/inactive status
- Enable or disable a single validation rule
- Enable all / Disable all validation rules
- Search validation rules by rule name or object
- Real-time updates reflected directly in Salesforce
- Clean dashboard-style UI

---

## 🛠️ Tech Stack

- React.js
- JavaScript
- Salesforce OAuth 2.0
- Salesforce Tooling API
- HTML/CSS

---

## 🔄 Project Workflow

1. User logs in using Salesforce
2. Access token is captured from redirect URL
3. Validation rules are fetched using Salesforce Tooling API
4. User can enable/disable rules from the dashboard
5. Changes are updated directly in Salesforce in real time

---

## ⚙️ Setup Instructions

1. Clone the repository

   git clone https://github.com/Shubham3181/salesforce-validation-rule-manager.git  
   cd salesforce-validation-rule-manager

2. Install dependencies

   npm install

3. Run the project

   npm start

4. Open in browser

   http://localhost:3000

---

## 🔐 Salesforce Setup Required

1. Create a Salesforce Developer Org
   - Sign up and log in to your Salesforce Developer account

2. Create validation rules on the Account object
   - Account_Name_Required
   - Phone_Validation
   - Revenue_Validation
   - Website_Validation
   - Industry_Required

3. Create a Connected App / External Client App
   - Go to Setup → App Manager
   - Create a new Connected App / External Client App
   - Enable OAuth settings
   - Add callback URL: http://localhost:3000/callback
   - Copy Client ID (Consumer Key) and use it in your React app

4. Add CORS origin in Salesforce
   - Go to Setup → CORS
   - Add: http://localhost:3000

5. After deployment  
   Replace with your live URL:
   - Callback: https://salesforce-validation-rule-manager-pi.vercel.app/callback
   - CORS: https://salesforce-validation-rule-manager-pi.vercel.app

---

## 🔒 Security Note

- Client Secret is NOT stored in this application
- Access tokens are generated dynamically after login
- No sensitive credentials are hardcoded except the public Client ID

---

## 👨‍💻 Author

Shubham Ghaytadkar
