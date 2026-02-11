# Dashboard 🚀

**Dashboard** is your **visual command center for tasks**, designed to make chaos obsolete.
Never lose track of your workflow — create, connect, and manage “tablets” for your tasks in a fully interactive, intuitive interface.

---

## 🌟 Features

- **Interactive Task Tablets** – Right-click to create, edit, delete, and connect your task nodes.
- **Visual Workflow Management** – See your tasks and their dependencies at a glance.
- **Real-Time Backend Integration** – Powered by **PHP + PostgreSQL**, your data is always live.
- **AJAX-Driven Updates** – No page reloads, instant feedback on all actions.
- **Persistent State** – Dockerized Postgres ensures your boards stay safe and portable.

---

## 🎯 How to Use

1. Open **Dashboard** in your browser (`http://localhost/`).
2. Right-click anywhere on the board to:
   - Create a new tablet
   - Edit an existing tablet
   - Delete a tablet
   - Add or remove connections
   - Save your board state

> Everything happens visually — no menus, no forms, just **click and manage your workflow**.

---

## 🛠 Development & Setup

Dashboard is fully containerized with **Docker + Docker Compose**.

**Quickstart:**

```bash
git clone https://github.com/RUN1-CS/Dashboard.git
cd Dashboard
cp .env.example .env
# Fill in your DB credentials
docker compose up -d --build
```

- PHP backend is isolated in `app/Backend`
- Frontend lives in `app/Frontend`
- PostgreSQL runs in a separate container with persistent storage
- AJAX calls handle all frontend-backend communication
- `.env` manages your DB connection safely

> Your dev environment can be mirrored anywhere — Fedora, Debian, or even CI/CD pipelines — with **one command**.

---

## 🚀 Roadmap

| Phase               | Status      |
| ------------------- | ----------- |
| Core mechanics      | ✅ Done     |
| Backend             | ✅ Done     |
| GUI settings        | ⚡ Improved |
| Additional features | 🛠 Future   |

---

## 🔒 Security & Best Practices

- Backend logic is **outside the web root**
- AJAX endpoints route through controlled Frontend-facing PHP files
- Docker ensures isolated, reproducible environments
- `.env` keeps sensitive credentials private

---

## 💖 Support / Patreon

If you enjoy this project and want to support development, check out my Patreon: [https://www.patreon.com/cw/RUN1_IT](https://www.patreon.com/cw/RUN1_IT)

---

## 📄 License

Open-source under the [MIT License](LICENSE)
© 2026 **RUN1** (GitHub: [RUN1-CS](https://github.com/RUN1-CS))
