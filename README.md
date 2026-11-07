# RiderZ - Cycling Community Platform (Frontend)

A web application built for the **RiderZ** cycling team in Syria. The goal was to create a centralized platform where members can discover upcoming rides, book their seats, manage their profiles, and track their stats on a leaderboard.

The backend is a private ASP.NET Core API, and this repository contains the frontend built with React and Vite.

**Live Demo:** [riderz-team.vercel.app](https://riderz-team.vercel.app)

## Built With

- **React 19.2.8** (Vite)
- **Tailwind CSS** (for styling)
- **React Router v7** (Routing)
- **Axios** (with custom interceptors for JWT & automatic refresh tokens)
- **Lucide React** (Icons)
- **Vercel** (Deployment)

## What's inside

- **Authentication flow:** Login, Signup, Forgot/Reset Password.
- **Ride Discovery:** Browse rides, filter by level, and view full details including routes and maps.
- **Booking System:** Book a ride, choose add-ons (helmet/bike), and upload a payment receipt for admin review.
- **User Profiles:** Customize avatars, cover photos, bike details, and social links.
- **Leaderboard:** A dynamic podium showing the top riders based on kilometers ridden.
- **Admin Dashboard:** A full control panel to manage users, create rides, and approve/reject bookings.
- **Performance & UI:** Fully responsive, lazy-loaded pages, and optimized images (WebP).

## Getting Started
