# RedactieRadar

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![ShadCN/UI](https://img.shields.io/badge/ShadCN%2FUI-000000?style=for-the-badge&logo=shadcn&logoColor=white)

---

## 🧭 Overview

**RedactieRadar** is a modern newsroom dashboard application for regional journalists to track local signals, scan news sources, and manage editorial priorities. Built with React, Supabase, and Vite, the tool enables efficient signal processing and lead management within a collaborative environment.

---

## 🖼️ Screenshot

![Screenshot of the app](public//img/image.png)

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/cindybruikman/radar-redactie.git
cd radar-redactie
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> ⚠️ Replace with your actual Supabase project credentials.

---

### 4. Start the Development Server

```bash
npm run dev
```

Then go to [http://localhost:3000](http://localhost:3000)

---

### 5. Production Build

```bash
npm run build
npm run preview
```

---

## 🛠 Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start local dev server       |
| `npm run build`     | Create production build      |
| `npm run preview`   | Preview built app locally    |
| `npm run lint`      | Run ESLint on codebase       |

---

## 📄 License

MIT License
