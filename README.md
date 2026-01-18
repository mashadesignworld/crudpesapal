# CRUD Application with M-Pesa STK Push & Sanity CMS

This is a full-stack **CRUD web application** built with **Next.js** and **React**, featuring user authentication, database integration using **Prisma**, payment processing via **M-Pesa STK Push**, and content management with **Sanity CMS** for viewing and managing donations.

The project demonstrates modern web development practices, including serverless databases, secure authentication, API integration, and scalable UI architecture.

---

## Features

* Create, Read, Update, and Delete (CRUD) functionality
* User authentication using **NextAuth**
* Secure password hashing with **bcrypt**
* M-Pesa **STK Push** integration for donations/payments
* Donation records managed and viewed via **Sanity CMS**
* Google OAuth login support
* Responsive UI built with **Tailwind CSS** and **Styled Components**
* Tooltips and UI enhancements using Radix UI and Tippy
* Prisma ORM with support for Neon and SQLite
* Toast notifications for user feedback

---

## Tech Stack

### Frontend

* Next.js 15
* React 19
* Tailwind CSS
* Styled Components
* Radix UI
* Lucide Icons
* React Icons
* Tippy.js

### Backend / APIs

* Next.js API Routes
* Prisma ORM
* NextAuth
* Axios

### Databases

* Neon (Serverless PostgreSQL)
* SQLite (for local development)
* MongoDB (via Mongoose, where applicable)

### Payments & CMS

* M-Pesa STK Push (Safaricom Daraja API)
* Sanity CMS

---

## Dependencies

### Main Dependencies

* `next`, `react`, `react-dom`
* `@prisma/client`, `@prisma/adapter-neon`
* `@neondatabase/serverless`
* `next-auth`
* `mongoose`
* `better-sqlite3`
* `bcryptjs`
* `axios`
* `react-hot-toast`
* `styled-components`
* `tailwind`
* `next-sanity`

### Development Dependencies

* `prisma`
* `@tailwindcss/postcss`

---

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# M-Pesa
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
```

---

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run database migrations (if applicable):

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## M-Pesa STK Push Flow

1. User initiates a donation
2. Backend generates STK Push request
3. User confirms payment on their phone
4. Callback URL processes the transaction
5. Donation data is stored and synced with Sanity CMS

---

## Sanity CMS

Sanity is used to:

* View donation records
* Manage donation-related content
* Provide a structured and scalable CMS dashboard

---

## Project Purpose

This project is intended to:

* Demonstrate real-world CRUD application development
* Showcase payment gateway integration (M-Pesa)
* Highlight experience with Prisma, Next.js, and CMS tools
* Serve as a portfolio or production-ready foundation

---

## License

This project is open-source and available under the MIT License.

---

## Author

**Kevin Macharia**
Full-Stack Web Developer
Specializing in Next.js, Prisma, and modern web technologies
