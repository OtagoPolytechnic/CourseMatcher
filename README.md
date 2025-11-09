# CourseMatcher - Setup Guide

This project is a full-stack web application for comparing university courses using Open AI-powered semantic matching. It includes a **FastAPI backend** and a **React frontend**

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116.1-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)

---

## Prerequisites

Before starting, ensure you have the following installed:

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js + npm](https://nodejs.org/)

**Also please review the file structure documentation for this project if you are a new contributer:**

https://github.com/OtagoPolytechnic/CourseMatcher/wiki/File-Structure-Documentation

---

## 🚀 Project Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/OtagoPolytechnic/CourseMatcher.git
cd CourseMatcher
```
### 2️⃣ Run the automated setup script from the project root directory

⚠️ Important

- Before running the setup script, open the requirements.txt file located in the backend directory. Replace the following dependency line:
  
<img width="426" height="41" alt="image" src="https://github.com/user-attachments/assets/d05efe7f-7c71-4b99-b83d-323392d9c2cd" />

With:

<img width="109" height="23" alt="image" src="https://github.com/user-attachments/assets/b0ec305f-9de2-46c3-bd87-774fb2fa3230" />

Why?

The first dependency (2.4.0+cpu) is used only by Render during deployment to install the lightweight CPU-only version of PyTorch, avoiding timeouts caused by large CUDA packages.
The second version (2.7.1) is for local development, where CUDA packages can safely be installed — though it may take longer to complete.

⚠️ Note:

Do not commit or push the torch==2.7.1 version requirements.txt file to the main branch.
Keep this modification local to prevent deployment issues on Render.
If needed, you can revert or manage the switch manually depending on your development environment.

You can then run:

```bash
./setup.bat
```

This script does all of the following:

Sets up a virtual environment for the backend
- Installs all backend Python dependencies
- Installs all frontend npm packages
- Creates a default .env file in the backend
- Creates a default .env file in the frontend

### 3️⃣ Add your OpenAI API key to the .env file

<img width="303" height="84" alt="image" src="https://github.com/user-attachments/assets/ff09c4e6-6c59-4fe1-918e-fad306639eda" />

Ensure that you are able to run both the frontend and the backend simultaneously. In VS Code you can open two terminals and run FastAPI from one while using the other to run React's frontend. 

### 4️⃣ Running the FastAPI server

From the backend/ folder ensure that the virtual environment activated

```bash
venv\Scripts\activate
```

Then run 

```bash
uvicorn app.main:app --reload
```
<img width="837" height="135" alt="image" src="https://github.com/user-attachments/assets/aa9cddc4-4826-45b7-a09d-ef4d5c8b5ec9" />

Navigate to http://127.0.0.1:8000. The courses endpoint can be found at http://localhost:8000/courses/

<img width="1238" height="978" alt="image" src="https://github.com/user-attachments/assets/41e52a3a-0efe-4d9f-a410-6d976d18ae53" />

### 5️⃣ Running the React frontend

From the frontend/ folder simply run `npm run dev`

<img width="512" height="248" alt="image" src="https://github.com/user-attachments/assets/d4f5df8b-5ff7-4a55-9cc6-a9387f1206d9" />


Deployed API: https://coursematcher-api.onrender.com/courses/

Deployed Web Service: https://coursematcher-web.onrender.com/

⚠️ Note:

The services are deployed using a free instance of Render. For that reason, the API service will go into a sleep mode if requests are not being actively made to it within a certain timeframe. If the service hasn't been accessed in a while, it could take a while to spin up and load the courses data.

