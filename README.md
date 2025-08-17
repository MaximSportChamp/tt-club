# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs; check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


## API Documentation

The frontend communicates with the backend through a REST API. See [docs/api.md](docs/api.md) for endpoint details, authorization requirements, and error formats.

## Components

The `src/components/common/` directory contains reusable components shared across different parts of the application.

## Documentation
Detailed documentation, including style guides and user scenarios, can be found in [docs/](docs/README.md).

## Environment Variables

### Frontend
Create a `.env` file in the project root and specify the backend API URL:

```
VITE_API_BASE_URL=https://stuch.online/api
```

Adjust the URL as needed for your deployment.

### Backend
Copy `backend/.env.example` to `backend/.env` and provide database credentials and secrets:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=ttclub
JWT_SECRET=change_me
SENTRY_DSN=
```

These values configure database connection, JWT signing, and Sentry reporting.

## CI/CD

GitHub Actions handles continuous integration and deployment:

- On every push or pull request, the workflow installs dependencies and runs `npm run lint` and `npm test`.
- The frontend is built with `npm run build` and uploaded to `/var/www/tt-club/` on the server.
- The `backend/` directory is copied to the server, dependencies are installed, database migrations are executed, and the service is started (or restarted) with PM2.

To enable deployments, configure the repository secrets `SERVER_HOST`, `SERVER_USER`, and `SERVER_SSH_KEY` with credentials for the target server.
