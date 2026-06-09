# 🚀 Mini Social Media Engine

A lightweight, secure full-stack social media application built with Node.js, Express, and MongoDB. This project demonstrates robust authentication, data relational integrity, and seamless CRUD operations wrapped in a modern UI.

🔗 **Live Demo:** [(https://mini-social-platform-fgnt.onrender.com/)]

---

## 🛠️ Tech Stack & Architecture

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose ODM) using Two-Way Referencing (User ↔ Post)
- **Security & Auth:** JSON Web Tokens (JWT), Bcrypt password hashing, Cookie-Parser
- **Frontend Engine:** EJS (Embedded JavaScript templates)
- **Styling:** Tailwind CSS

---

## ✨ Key Features

- **Secure Authentication:** Password hashing using salt rounds via `bcrypt` and state-handling via JWT cookies.
- **Dynamic Content Feed:** Full CRUD flow allowing authenticated users to create, update, and instantly delete their own posts.
- **Relational Integrity:** Implements MongoDB `$pull` operations to cleanly purge references from user profiles upon post deletion.
- **Interactive Engagements:** A seamless self-correcting toggle engine for Liking/Unliking posts.

---

## 🏃‍♂️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [(https://github.com/admirableankith/mini-social-platform.git)]
   cd [Your folder name]

2.Install dependencies:

    npm install

3.Configure Environment Variables:
create a .env file in the root directory (use .env.example as a template) and define the following:
     
     PORT=8080
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_random_jwt_secret

4.Launch the app
  
  node app.js
  Open http://localhost:8080 in your browser.

