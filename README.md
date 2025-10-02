#  Kōvah

**Kōvah** is a cross-platform social media application built with React Native and a custom Node.js backend. It's designed as a focused platform for educators and learners to connect, share content, and build communities. This project serves as a modern, scalable foundation for a full-featured social network.

---

## ✨ Features (Current Version)

-   **Custom Authentication:** Secure user sign-up and sign-in system built from scratch using JWTs for session management.
-   **Node.js + Express Backend:** A robust, custom API server for handling all application logic, written in TypeScript.
-   **PostgreSQL Database:** A powerful relational database for storing user data, posts, and social connections.
-   **Tab-Based Navigation:** A clean, intuitive mobile interface for navigating between the main app sections (Feed, Profile, etc.).
-   **Dynamic Social Feed:** A functional feed screen that fetches and displays posts from the backend in real-time.
-   **Post Creation:** A dedicated screen for users to create and submit new text-based posts to the community.

---

## 🚀 Tech Stack

This project is built using the **"Free Tier Champion"** stack, ensuring it can be developed, deployed, and scaled with a budget of $0 to start.

-   **Frontend:** [React Native](https://reactnative.dev/) (managed by [Expo](https://expo.dev/))
-   **Backend:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on [Render](https://render.com/))
-   **Media Storage:** [Cloudinary](https://cloudinary.com/) (for future image/video uploads)
-   **Language:** [TypeScript](https://www.typescriptlang.org/) (for both frontend and backend)
-   **Navigation:** [React Navigation](https://reactnavigation.org/)
-   **Authentication:** Custom JWT (JSON Web Tokens) Implementation

---

## ⚙️ Setup & Installation

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [Git](https://git-scm.com/)
-   [PostgreSQL Command Line Tools (`psql`)](https://www.postgresql.org/download/) installed locally.
-   A free account on [Render](https://render.com/) for database hosting.
-   A free account on [Cloudinary](https://cloudinary.com/) for media storage.

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kashyapvadgama/kovah
    cd Kovah
    ```

2.  **Frontend Setup (React Native):**
    This sets up the mobile application.
    ```bash
    # Install frontend dependencies
    # Use --legacy-peer-deps to resolve minor dependency conflicts
    npm install --legacy-peer-deps

    # Start the Expo development server
    npx expo start
    ```
    Follow the on-screen instructions to run the app on an emulator or a physical device using the Expo Go app.

3.  **Backend Setup (Node.js):**
    This sets up the API server. You will need a separate terminal for this.

    **a. Configure Environment Variables:**
    -   Navigate to the `backend` directory: `cd backend`
    -   Rename the example environment file: `ren .env.example .env` (on Windows) or `mv .env.example .env` (on macOS/Linux).
    -   **Set up your free PostgreSQL database on Render.** Once created, copy the **Internal Connection URL**.
    -   **Set up your free Cloudinary account.** Find your `Cloud Name`, `API Key`, and `API Secret` on the dashboard.
    -   Open the `.env` file and fill in your credentials:
        ```env
        DATABASE_URL="your_render_database_url_here"
        PORT=3001
        JWT_SECRET="your_super_secret_random_string_here"
        CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
        CLOUDINARY_API_KEY="your_cloudinary_api_key"
        CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
        ```
      > **Note:** Use a strong, random string for `JWT_SECRET`. You can generate one by running `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` in your terminal.

    **b. Set Up the Database Schema:**
    -   Connect to your Render database using their CLI (`render psql`) or any PostgreSQL client.
    -   Copy the entire content of the `database/schema.sql` file and execute it to create all the necessary tables.

    **c. Install Dependencies and Run the Server:**
    ```bash
    # From the backend directory
    npm install

    # Start the development server (it will auto-restart on file changes)
    npm run dev
    ```
    You should see the message: `🚀 Kovah backend is running on http://localhost:3001`

4.  **Connect Frontend to Backend:**
    -   Find your computer's local IP address (e.g., `192.168.1.5`).
    -   Open the files that make API calls (like `api/client.ts`, `screens/auth/SignInScreen.tsx`, etc.).
    -   Update the `API_URL` constant with your computer's local IP address.
        ```typescript
        // Example:
        const API_URL = 'http://192.168.1.5:3001';
        ```

You should now have both the frontend and backend running and connected!

## 🗃️ Database Schema

The core schema includes tables for users, profiles, content, and communities.

### `users` table
Stores private authentication information like email and hashed passwords.

### `profiles` table
Stores public user information like username, full name, and avatar URL. Linked one-to-one with the `users` table.

### `posts` table
Stores all user-generated content, including text and links to media stored on Cloudinary.

### `follows`, `communities`, `post_likes`, `post_comments`
Standard social media tables to manage the social graph and interactions.

For the full schema, see `database/schema.sql`.

## 🛣️ Project Roadmap

-   [✓] **Post Creation:** Add image and video upload functionality using Cloudinary.
-   [✓] **User Profiles:** Build out the user profile screen with bio, posts, and follower counts.
-   [ ] **Communities:** Implement features for creating, joining, and posting in communities.
-   [ ] **Real-time Features:** Add WebSocket support for live notifications and comments.
-   [ ] **Secure Token Storage:** Implement `expo-secure-store` to safely store the JWT on the device for persistent login.

---
*This README is a living document. As the project evolves, please update it with any changes to the architecture, setup process, or tech stack.*
