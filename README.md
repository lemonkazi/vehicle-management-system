# Vehicle Management System

This is a comprehensive system to manage vehicles, drivers, and owners, built with Next.js, Prisma, and MySQL.

## Project Setup

You can set up and run this project either with Docker (recommended for ease of use) or on your local machine without Docker.

### With Docker (Recommended)

This is the easiest way to get the project running, as it automatically sets up the database and application services.

**Prerequisites:**
- Docker and Docker Compose installed on your machine.

**Instructions:**

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username_/vehicle-management.git
    cd vehicle-management
    ```

2.  **Create and configure the environment file:**
    Copy the example environment file. The default values are already configured for the Docker setup.
    ```sh
    cp .env.example .env
    ```
    *Note: You should change `NEXTAUTH_SECRET` and `JWT_SECRET` to your own secret keys for production.*

3.  **Build and run the services:**
    This command will build the Next.js application image, start the `app`, `mysql`, and `phpmyadmin` containers, and run them in the background.
    ```sh
    docker-compose up -d --build
    ```

4.  **Apply database schema:**
    Once the containers are running, execute the `prisma db push` command inside the `app` container to create the database tables based on your schema.
    ```sh
    docker-compose exec app npx prisma db push
    ```

5.  **(Optional) Seed the database:**
    To populate the database with initial data, run the seed script.
    ```sh
    docker-compose exec app npm run db:seed
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000), and phpMyAdmin will be accessible at [http://localhost:8080](http://localhost:8080).

### Without Docker

Follow these steps if you prefer to run the project on your local machine without using Docker.

**Prerequisites:**
- Node.js (v18 or later)
- npm or yarn
- A running MySQL server instance

**Instructions:**

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your_username_/vehicle-management.git
    cd vehicle-management
    ```

2.  **Install project dependencies:**
    ```sh
    npm install
    ```

3.  **Set up the environment file:**
    Copy the example environment file:
    ```sh
    cp .env.example .env
    ```
    Now, edit the `.env` file and update the `DATABASE_URL` to point to your local MySQL instance. For example:
    ```
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```
    Also, set your own secrets for `NEXTAUTH_SECRET` and `JWT_SECRET`.

4.  **Apply database schema:**
    This command will sync your Prisma schema with your database, creating the necessary tables.
    ```sh
    npx prisma db push
    ```

5.  **(Optional) Seed the database:**
    ```sh
    npm run db:seed
    ```

6.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Build Process

### With Docker

The Docker build process is defined in the `Dockerfile` and is automatically executed when you run `docker-compose up --build`. It performs the following steps:
1.  Installs dependencies (`npm install`).
2.  Generates the Prisma client (`npx prisma generate`).
3.  Creates a production build of the Next.js application (`npm run build`).
4.  The `docker-compose.yml` then uses this image to run the application, starting it with `npm start`.

### Without Docker

To create a production build and run it locally:

1.  **Build the application:**
    ```sh
    npm run build
    ```
    This command creates an optimized production build in the `.next` directory.

2.  **Start the production server:**
    ```sh
    npm run start
    ```
    This starts a Node.js server that serves the built application.
