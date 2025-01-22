# *QuickHeal Web App*  
 Revolutionizing Healthcare with Seamless Video Consultations, Query Management, and Prescriptions  

---

## *Overview*  
QuickHeal is a comprehensive healthcare web app designed to connect patients and doctors effortlessly.  
- Patients can consult with doctors via *video calls*, manage their **queries**, and receive **prescriptions**.  
- Doctors can manage *availability*, respond to queries, and provide prescriptions efficiently.  
- The app also features an *admin panel* for management, accessible via specific routes.  

---

## *Key Features*  

### *For Patients*  
-  *Video Consultations*: Initiate video calls with available doctors using **Socket.io** for real-time communication.  

### *For Doctors*  
-  *Availability Status*: Toggle status (Available/Unavailable) to indicate readiness for consultations.  
- *Query Management*: View and respond to patient queries.  

### *Admin Panel* (Accessible via routes)  
- /admin: Main admin dashboard.  
- /admin/auth: Authentication page for admin login.  
(Not part of visible website navigation but accessible via direct URL routes.)  

---

##  *Tech Stack*  

- *Frontend*: ⚛️ React, 🌊 Tailwind CSS  
- *Backend*: 🟢 Node.js, ⚡ Express.js  
- *Database*: 🍃 MongoDB  
- *Real-Time Communication*: 📡 Socket.io  
- *Video Call Integration*: 📹 WebRTC/Third-Party API  
- *Authentication*: 🔐 Bcrypt Password Hashing for Patients, Doctors, and Admin.  
- *Hosting*: Vercel, Render

---

##  *Live Demo*  
🔗 Visit QuickHeal: [QuickHeal Web App](https://quickheal.vercel.app/)  

---

##  *Screenshots*  
### *Patient Dashboard*  
![Patient Dashboard](https://github.com/user-attachments/assets/171ec425-980e-44bc-a4fc-d37dab488663)  

### *Doctor Panel*  
![Doctor Panel](https://github.com/user-attachments/assets/683411e1-5c8d-4c4e-ae12-3de6b244c9d2)  

### *Video Consultation*  
![Video Consultation](https://github.com/user-attachments/assets/25f55d01-60d9-43ae-a68d-cd1a4e82019a)  


---

## *Setup Guidelines*

This guide outlines the setup process for the Quick Heal project, including environment configuration and client/server setup.

---

### **Prerequisites**

- **Node.js**: Install the latest LTS version of Node.js.
- **Package Manager**: Use `npm` for installation of packages.
- **Database**: Ensure MongoDB is installed and running locally or on a server.
- **TypeScript**: Install globally if not already available.

```bash
npm install -g typescript
```

- **Nodemon**: Install globally for server development.

```bash
npm install -g nodemon
```

---

### **Clone the Repository**

1. **Clone the Project**

   ```bash
   git clone https://github.com/joefelx/quickheal.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd quickheal
   ```

---

### **Environment Setup**


Create an `.env` file in both the `client` and `server` directories with the following configurations:

#### Client

```env
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_PASSCODE=your_passcode_here
REACT_APP_CHATBOT_API_KEY=your_chatbot_api_key_here
```

#### Server

```env
PORT=5000
MONGO_URL=your_mongo_connection_string_here
JWT_SECRET=your_jwt_secret_here
SUPERADMIN_PASSCODE=your_superadmin_passcode_here
```

> Replace the placeholders with your specific configuration values.

---

### **Setting Up Chatbot Integration**

1. **Obtain the Chatbot API Key**

   Visit the [Gemini API documentation](https://ai.google.dev/gemini-api/docs) to sign up and generate your API key for chatbot integration.

2. **Update Environment Variables**

   Add the API key to the client `client/.env` file:

   ```env
   REACT_APP_CHATBOT_API_KEY=your_chatbot_api_key
   ```
    >Replace `your_chatbot_api_key` with the key obtained from Gemini.

---

### **Client Setup**

1. **Navigate to the Client Directory**

   ```bash
   cd client
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Development Server**

   ```bash
   npm start
   ```

   The client will be available at [http://localhost:3000](http://localhost:3000).

---

### **Server Setup**

1. **Navigate to the Server Directory**

   ```bash
   cd server
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Server in Development Mode**

   ```bash
   npm run dev
   ```

   The server will be available at [http://localhost:5000](http://localhost:5000).

---



##  *Security*  

QuickHeal ensures data privacy and security with:  
- 🔐 *Secure Password Storage* for all users (Patients, Doctors, and Admin).  
- 🔒 *Secure communication* via HTTPS (if hosted on a secure domain).  

---

##  *Future Enhancements*  

- 📱 *Mobile app* for better accessibility.  
- 🗂️ *Comprehensive patient medical history* management.  
- 🤖 *AI-powered symptom checker* for preliminary diagnosis.  
- 🔄 *Integration with pharmacy services* for medication delivery.  

---

## *Core Contributors*  

- *[Joe Felix A](https://github.com/joefelx)*  (Backend)
- *[Karim Suhail S](https://github.com/karimsuhail)  (Frontend)*
- *[Mohammed Haris Hasan A](https://github.com/Haris-Off)*  (Low Level Design)

---

## *License*  

This project is licensed under the [MIT License](LICENSE).  

---

##  *Thank You*  

We appreciate your interest in QuickHeal.  
If you have suggestions, feedback, or want to contribute, feel free to reach out.  
