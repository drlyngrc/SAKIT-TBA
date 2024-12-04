# <img src="Icon/icon.png" alt="SAKIT Icon" width="30" height="30"> **SAKIT**  
**_Systematic Analysis of Known Infections in Terrestrial Plants_**  

---

[![🌱 Try SAKIT](https://img.shields.io/badge/Try-SAKIT-brightgreen?style=for-the-badge)](http://127.0.0.1:5500/main.html)  

---

## **🌟 I. Overview**  

**SAKIT** is a web application designed to identify plant diseases from user-uploaded images using image analysis powered by machine learning. By leveraging advanced algorithms, **SAKIT** diagnoses infections and provides actionable insights for effective plant care. This tool aims to enhance agricultural practices, reduce crop loss, and promote healthier ecosystems.

<div align="center"><img src="Icon/main.png" alt="SAKIT main" width="480" height="300">  </div>

---

## **🏗 II. System Architecture**  

### **🌐 Frontend**  
- **Technologies**: HTML, CSS, JavaScript  
- **Features**:  
  - Responsive design for various devices.  
  - Fetch API for communication with the backend.  

### **🖥 Backend**  
- **Technologies**: FastAPI, Flask  
- **Language**: Python  
- **Libraries**: TensorFlow, OpenCV, NumPy  

### **🤖 Machine Learning Model**  
- **Type**: Convolutional Neural Network (CNN)  
- **Trained On**: Custom dataset with 900+ labeled images of plant diseases.  

### **🗄 Database**  
- **Type**: Firebase (Cloud Firestore)  
- **Purpose**:  
  - Stores user data, detection history, and analysis results.  
  - Offers real-time synchronization for logged-in users.  

### **🚀 Deployment**  
- Hosted on AWS EC2 for the backend and Firebase Hosting for the frontend.

---

## **💻 III. Applied Computer Science Concepts**  
- **Machine Learning**:  
   - Implemented a CNN for image analysis and classification.  
- **Database Management**:  
   - Real-time data handling using Firebase.  
- **API Design**:  
   - Backend APIs for image processing and user interaction.  
- **Web Development**:  
   - Responsive and interactive user interface.  

---

## **📋 IV. Algorithms Used**  

1. **🧠 Convolutional Neural Networks (CNNs)**:  
   - Used for feature extraction and classification of plant diseases.  
   - Architecture: Multiple convolutional layers, pooling layers, and dense layers.  

2. **🖼 Image Preprocessing**:  
   - Resizing, normalization, and data augmentation to improve model accuracy.  

3. **🔄 Real-Time Database Sync**:  
   - Leveraged Firebase’s efficient algorithms for data synchronization.  

---

## **🔒 V. Security Mechanism**  

1. **🔑 User Authentication**:  
   - Firebase Authentication is used for secure login and registration.  
2. **🔐 Data Encryption**:  
   - Firebase encrypts all data in transit and at rest.  
3. **🛡 API Security**:  
   - Backend endpoints are secured with token-based authentication.  
4. **✅ Input Validation**:  
   - Frontend and backend sanitize user inputs to prevent injection attacks.  

---

## **🛠 VI. Development Process and Design Decisions**  

1. **📅 Development Methodology**:  
   - Agile development with iterative releases.  

2. **🎨 Design Decisions**:  
   - **Frontend**: Chose plain HTML, CSS, and JavaScript for simplicity and wide browser support.  
   - **Backend**: Combined FastAPI for speed and Flask for specific tasks requiring flexibility.  
   - **Database**: Used Firebase for its scalability and real-time features.  

3. **🔍 Testing**:  
   - Conducted unit testing for backend APIs and integration testing for the system.  

---

## **✅ VII. Correctness and Efficiency**  

1. **🧐 Correctness**:  
   - The model achieves 92% accuracy on the validation dataset, ensuring reliable predictions.  
   - User data is stored securely and synced accurately across sessions.  

2. **⚡ Efficiency**:  
   - Optimized API response times by preloading the ML model in memory.  
   - Reduced database query times using Firebase’s indexed data structure.  

---

## **🖥 VIII. How to Run the Project**  

### **🔧 Prerequisites**  
- **Python** (v3.9 or later)  
- **Flask**  
- **TensorFlow**  
- **Firebase Admin SDK**  

### **🚀 Steps**  

#### 1. **📥 Clone the Repository**  
   ```bash
   git clone https://github.com/glngnbn/SAKIT/sakit.git
   cd sakit
   ```

### 2. **🖼 Frontend Setup**
   ```bash
   cd frontend
   python -m http.server
   ```  

### 3. **🖥 Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```  
### 4. **🔧 Firebase Setup**
- Add google-services.json to the backend directory.
- Update Firebase API configuration in the backend code.

### 5. **🏃 Run the Application**
- I. Start the Backend Server
     - Run the Flask backend script using the command:
       ```bash
       python app.py
       ```
     - By default, the backend will be accessible at http://127.0.0.1:5000.
- II. Access the Frontend
     - Open a browser and navigate to http://127.0.0.1:5500/main.html  

---

## **👨‍💻 IX. Contributors**  
- **Backend Developer**: [Barican, John Andrei A.](https://github.com/e4677)  
- **Project Manager/Fullstack Developer**: [Guinoban, Glenn M.](https://github.com/glngnbn)  
- **Frontend Developer**: [Lalongisip, Darlyne Grace M.](https://github.com/drlyngrc)  

---

## **🥰 X. Acknowledgement** 
The developers would like to extend their acknowledgment to their course instructor, Ms. 
[Fatima Marie P. Agdon](https://github.com/marieemoiselle) for her invaluable support throughout the development of this project. Also, the developers would like to acknowledge their effort, perseverance, and dedication for the timely success of the system.
