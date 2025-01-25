# EaglePasswords Monorepo

Welcome to the **EaglePasswords** monorepo, which houses the backend, frontend, and additional components for the EaglePasswords project. This project is designed to manage passwords securely and efficiently, with features such as login via Discord, a password manager, and a Firefox extension.

### Apps

- **backend**: Contains the server-side code, including API routes, authentication, password management, and database configurations. Built with TypeScript and Express, with MongoDB as the database. It also supports login via Discord for the sole user.
  
- **frontend**: Contains the client-side code for the EaglePasswords web interface. Built with Next.js and styled with Tailwind CSS, this app provides the user interface for interacting with the backend, including managing passwords and two-factor authentication.

### Getting Started

To get started with development, you'll need to set up the backend and frontend locally.

#### Backend Setup

1. Navigate to the `apps/backend` folder:

   ```bash
   cd apps/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in [.env](https://github.com/prodbyeagle-inc/EaglePasswords/blob/main/backend/.env.example) as needed for your local environment.

4. Run the development server:

   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the `apps/frontend` folder:

   ```bash
   cd apps/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in [.env](https://github.com/prodbyeagle-inc/EaglePasswords/blob/main/frontend/.env) for the frontend if necessary.

4. Run the frontend development server:

   ```bash
   npm run dev
   ```

The frontend should now be accessible at `http://localhost:3000`.

### Deployment

The backend is deployed to [Vercel](https://vercel.com/) and the frontend is accessible at the specified production URL once deployed.

### Contributing

1. Fork the repository and create a new branch for your changes.
2. Ensure the backend and frontend are both working correctly after your changes.
3. Run the tests and ensure they pass.
4. Submit a pull request with a detailed description of your changes.

### License

This project is licensed under the MIT License.

---

Feel free to contribute, report issues, or suggest features! We aim to keep **EaglePasswords** secure, easy to use, and constantly improving.
