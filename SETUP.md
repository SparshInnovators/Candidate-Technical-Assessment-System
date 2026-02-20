# 🛠️ Project Setup Guide

This guide will walk you through setting up the **Candidate Technical Assessment System** locally.

## ✅ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- An **Appwrite Cloud** account (or a local Appwrite instance)

---

## 1️⃣ Appwrite Configuration (The "Backend")

First, we need to prepare the Appwrite project environment.

1.  **Create a Project**: Log in to [Appwrite Cloud](https://cloud.appwrite.io/) and create a new project (e.g., `Assessment System`).
2.  **Get Project ID**: Copy the `Project ID` from the project settings.
3.  **Create API Key**:
    *   Go to **Overview** > **Integrations** > **API Keys**.
    *   Create a new API Key with the following scopes:
        *   `databases.write`, `databases.read`
        *   `collections.write`, `collections.read`
        *   `documents.write`, `documents.read`
        *   `buckets.write`, `buckets.read`
        *   `files.write`, `files.read`
    *   Copy the `API Key Secret`.

### Run the Setup Scripts

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Fill in your Appwrite credentials in `.env`:
        ```env
        APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
        APPWRITE_PROJECT_ID=your_project_id_here
        APPWRITE_API_KEY=your_api_key_secret_here
        ```
4.  Run the initialization script:
    This will automatically create the database, collections, storage bucket, and seed initial question data.
    ```bash
    npm run setup:all
    ```
    *(Note: Check the console output! It may print IDs you need for the frontend configuration)*

---

## 2️⃣ Frontend Setup

Now let's get the React application running.

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Update `.env` with your project details. Ensure the Collection IDs and Bucket ID match what was created in the backend step (or use the defaults if the script used standard IDs).
        ```env
        VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
        VITE_APPWRITE_PROJECT_ID=your_project_id_here
        # The IDs below are defaults; verify them in your Appwrite Console if needed
        VITE_APPWRITE_DATABASE_ID=assessment_db
        VITE_APPWRITE_QUESTIONS_COLLECTION_ID=questions
        VITE_APPWRITE_ASSESSMENTS_COLLECTION_ID=assessments
        VITE_APPWRITE_RESULTS_COLLECTION_ID=results
        VITE_APPWRITE_RESUMES_BUCKET_ID=resumes
        ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## 🚀 Validating the Installation

1.  Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).
2.  Try to **Register** a new user account.
3.  If successful, you should be redirected to the dashboard where you can start a technical assessment!
