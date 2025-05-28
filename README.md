# 🌾 Bright Farms Academy – React + Vite

Bright Farms Academy is a modern, agriculture-focused e-learning platform built with **React**, **Vite**, and **Tailwind CSS**, inspired by platforms like **Udemy**. It provides an intuitive learning experience for students and a robust administration interface for course creators.

## 🚀 Features

- 🌱 **Agri-centric eLearning**: Designed for agriculture-based education.
- 📚 **Course Management**: Admins can create and manage rich course content with modules, lessons, videos, quizzes, and assignments.
- 🧑‍🏫 **Instructor Management**: Add instructors with bios and roles.
- 📝 **Interactive Learning**: Students can take quizzes and submit assignments as part of their learning journey.
- 📧 **Email Verification**: New users must verify their email before gaining full access.
- 🧪 **Demo Account**: Explore the platform without creating an account:
  - **Email**: `pbol.gh.dev@gmail.com`
  - **Password**: `123456789`

## 🔐 Authentication

Powered by **Supabase Auth**:
- Users can sign up with their real email address.
- A confirmation email is sent to verify their account.
- After verification, users can enroll in courses and track progress.

## 🧑‍💼 Admin Panel

- Add/edit courses with:
  - Modules & lessons
  - Embedded or uploaded videos
  - Quizzes & assignments
- Manage course visibility, categories, pricing, and student interaction.
- Tailored specifically for non-technical admins.

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)

## 📦 Installation

```bash
npm install
npm run dev


📂 Folder Structure
src/components – Reusable UI components

src/pages – Views for both student and admin roles

src/lib – Supabase configuration and helpers

src/store – Global state management using Zustand


🔗 External Links
Vite Documentation

Supabase Documentation

Tailwind CSS Docs

Zustand Docs

📣 Contributing
We welcome contributions to improve and expand the platform! Please fork the repo and submit a pull request.