# 🛍️ ShopNPoint — Smart E-Commerce Platform with ML-Driven Token Rewards  

### 🚀 Intelligent • Secure • Rewarding

---

## 🧩 Overview
**ShopNPoint** is a next-generation **e-commerce platform** that combines real-time shopping with a **machine-learning-based reward system**.  
Users earn **tokens** whenever someone purchases through their promo code — and can **redeem these tokens** for percentage-based discounts on future purchases.  

Our platform ensures **data security, token fairness, and fraud prevention** using AES encryption, SHA-256 hashing, and anomaly-detection ML models.

---

## 🌟 Key Highlights

| Feature | Description |
|----------|--------------|
| 🔐 **End-to-End Encrypted Promo Codes** | Promo codes are secured using **AES** and **SHA-256** to prevent tampering. |
| 🧠 **ML-Based Fraud Detection** | Uses **Isolation Forest**, **One-Class SVM**, and **Autoencoder** models to detect fake or abnormal token activity. |
| 💰 **Dynamic Token Reward System** | Code owners earn **15% of tokens** from referred purchases — dynamically calculated & updated in real-time. |
| 🧾 **Modern E-Commerce Core** | Built with **React + Vite** frontend and **Node.js + Express** backend. |
| ⚙️ **Flask ML Microservice** | Python service dedicated to fraud detection and dynamic reward validation. |
| 🪙 **Real-Time Token Management** | Tokens update instantly after each purchase — securely reflected in user dashboards. |

---

## 🏗️ System Architecture


graph TD
    subgraph Client-Side (React Frontend)
        A1[Auth Pages<br/>(Login, Register)]
        A2[Shop Pages<br/>(Home, Category, Product Detail)]
        A3[Dashboard<br/>(Profile, Tokens, Orders)]
        A4[Cart & Checkout]
    end

    subgraph Server-Side (Node.js API)
        B1[API Gateway]
        B2[Auth Service]
        B3[Product Service]
        B4[Order Service]
        B5[Reward Service]
    end

    subgraph Data & External Services
        C1[(MySQL DB)]
        C2[ML Service<br/>(Flask, Python)]
        C3[Payment Gateway]
    end

    User[🧍 User] --> A1 & A2 & A3 & A4
    A1 & A2 & A3 & A4 --> B1
    B1 --> B2 & B3 & B4 & B5
    B2 & B3 & B4 & B5 --> C1
    B5 --> C2
    B4 --> C3




🧠 Machine Learning Module

Language: Python
Framework: Flask API

Model	Purpose
🧩 Isolation Forest	Detects abnormal token-earning patterns
🕵️ One-Class SVM	Flags suspicious user activity or fake referrals
🧬 Autoencoder	Learns normal transaction patterns to find anomalies


📂 Structure

ml_service/
├── app.py                     # Flask API
├── models/                    # Trained ML Models
│   ├── isolation_forest.pkl
│   ├── oneclass_svm.pkl
│   └── autoencoder_model.h5
├── training/
│   ├── train_iforest.py
│   ├── train_ocsvm.py
│   └── train_autoencoder.py
└── utils/
    ├── preprocess.py
    └── feature_extract.py



💡 Token Flow Example

User X registers → Promo code auto-generated → Encrypted (AES) + Hashed (SHA-256).

User Y uses X’s promo code during checkout.

System validates hash → Confirms promo authenticity.

ML service analyzes token earning behavior.

If normal → X earns 15% tokens of Y’s purchase amount.

Tokens instantly update in both user dashboards.




⚙️ Tech Stack
Layer	Technology
🌐 Frontend	React.js + Vite + Tailwind CSS
🧩 Backend	Node.js + Express
🗄️ Database	MySQL
🔬 ML Microservice	Python + Flask + Scikit-Learn + TensorFlow
🔐 Security	AES-256 Encryption + SHA-256 Hashing
💳 Payment	Integrated Gateway (Test Mode)


# 1️⃣ Clone the repository
git clone https://github.com/DevOm-AI/ShopNPoint.git
cd ShopNPoint

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start frontend (Vite + React)
npm run dev

# 4️⃣ Start backend server
cd backend
npm install
npm start

# 5️⃣ Start ML Flask microservice
cd ml_service
pip install -r requirements.txt
python app.py
