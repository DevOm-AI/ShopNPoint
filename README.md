<div align="center">

<!-- HEADER BANNER -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1e3a5f,100:0ea5e9&height=200&section=header&text=ShopNPoint&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=Advanced%20Referral-Based%20E-Commerce%20Ecosystem&descSize=18&descAlignY=58&descColor=94d8f7&animation=fadeIn"/>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/Node.js-v16+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white&labelColor=0f172a"/>
  <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge&labelColor=0f172a"/>
</p>

<br/>

> **ShopNPoint** is a high-performance, full-stack e-commerce platform engineered to maximize user retention and acquisition through a sophisticated **Gamification Engine** and an **AI-driven Recommendation System**. Built for scalability and data integrity, it transforms the traditional shopping experience into a dynamic, reward-centric journey.

<br/>

</div>

---

## 🏛️ Key Architectural Pillars

<br/>

### `01` · Progressive Gamification Engine

> A state-driven engagement layer that rewards user loyalty through a non-linear leveling system.

| Feature | Description |
|---|---|
| **Quadratic Leveling Algorithm** | Implements a balanced progression curve — $\text{Level} = \lfloor \sqrt{XP/100} \rfloor + 1$ — to maintain long-term engagement |
| **Event-Driven Mission System** | Decoupled backend logic that monitors specific triggers (`PURCHASE`, `REFERRAL`) to award XP and Token payloads |
| **Atomic State Management** | Ensures transactional integrity during reward payouts, preventing race conditions in the Token economy |

<br/>

### `02` · Intelligent Recommendation Engine

> An analytical layer designed to personalize the storefront for every unique user profile.

| Feature | Description |
|---|---|
| **Collaborative Filtering** | Analyzes historical purchase patterns and user behavior to predict and suggest high-affinity products |
| **Dynamic UI Personalization** | Real-time frontend updates based on user interaction data to reduce choice paralysis and increase Conversion Rate (CR) |

<br/>

### `03` · Incentivized Referral Network

> A robust networking system that leverages social proof to drive organic growth.

| Feature | Description |
|---|---|
| **Unique Referral Persistence** | Secure generation and tracking of referral codes linked to user identity |
| **Two-Way Reward Logic** | Automated token distribution to both the referrer and referee upon successful conversion |

---

## 🛠️ Technical Stack

<br/>

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (Hooks & Context API) · Tailwind CSS · Framer Motion · Axios |
| **Backend** | Node.js · Express.js (RESTful API) · JWT (Stateful/Stateless Auth) |
| **Database** | MySQL 8.0 · Promise-based Connection Pooling (Optimized for High-Frequency Writes) |
| **UI / Icons** | Lucide-React · Glassmorphism Design Pattern |

<br/>

```
shopnpoint/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (Auth, Cart, Gamification)
│   │   └── pages/          # Route-level page components
├── backend/                # Express.js API server
│   ├── routes/             # Endpoint definitions
│   ├── middleware/         # JWT auth, error handling
│   └── controllers/        # Business logic
└── database/
    └── schema.sql          # Migration + seed scripts
```

---

## 🗃️ System Design & Database Schema

The platform utilizes a **Normalized Relational Schema** to ensure zero data redundancy and high referential integrity across the gamification and order modules.

<br/>

```sql
-- Centralized ledger for XP, Rank, and Daily Login Streaks
user_gamification (user_id, xp, level, rank, streak_days, last_login)

-- Master-to-Junction relationship tracking atomic progress towards rewards
missions        (id, title, type, xp_reward, token_reward, trigger_event)
user_missions   (user_id, mission_id, progress, status, completed_at)

-- Milestone-based achievement tracking with automated threshold validation
badges          (id, name, icon, threshold_type, threshold_value)
user_badges     (user_id, badge_id, awarded_at)
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** v16+
- **MySQL** 8.0+
- **npm** or **yarn**

<br/>

### Installation & Deployment

**1 · Clone the Repository**

```bash
git clone https://github.com/DevOm-AI/shopnpoint.git
cd shopnpoint
```

**2 · Environment Configuration**

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
JWT_SECRET=your_high_entropy_secret

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=shopnpoint_db
```

**3 · Dependency Management**

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

**4 · Database Migration**

```bash
# Execute schema and seed scripts
mysql -u root -p shopnpoint_db < database/schema.sql
```

**5 · Launch**

```bash
# Start backend dev server
cd backend && npm run dev

# Start frontend
cd frontend && npm start
```

> App runs on `http://localhost:3000` · API on `http://localhost:5000`

---

## 👨‍💻 Developer

<br/>

<div align="center">

| | |
|:---:|:---|
| <img src="https://github.com/DevOm-AI.png" width="72" height="72" style="border-radius:50%"/> | **Om Shete** <br/> B.E. — Artificial Intelligence & Data Science <br/> Pune, India · [Portfolio](https://devom-ai.vercel.app) · [LinkedIn](https://linkedin.com/in/devom-ai) · [GitHub](https://github.com/DevOm-AI) |

</div>

<br/>

---

## 📄 License

This project is licensed under the **MIT License** — see the [`LICENSE`](./LICENSE) file for details.

<br/>

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0ea5e9,50:1e3a5f,100:0f172a&height=100&section=footer&animation=fadeIn"/>

</div>
