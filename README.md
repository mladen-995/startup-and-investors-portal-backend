# startup-and-investors-portal-backend

# Requirements
In order to setup project on your local machine, you need to have the following installed:
1. [NPM](https://www.npmjs.com/)
1. [Docker](https://docs.docker.com/get-docker/)
1. [Docker compose](https://docs.docker.com/compose/install/)

# How to setup the project?
1. Copy `.env.example` to `.env`
1. Run `npm run docker-up`
1. The app is running on http://localhost:3000/

# How I can start/stop the project?
You can use the following commands:
- `npm run docker-up`: Start the environment
- `npm run docker-down`: Stop the environment
- `npm run docker-rebuild`: Rebuild containers

# How I can access the database?
Once you run the app with `npm run docker-up`, you can visit http://localhost:8080/ where [Adminer](https://www.adminer.org/) database managment tool is running which you can use to connect to the database.

# What env variables in the .env mean?
- NODE_PORT: The port on which the app is running
- DB_USER, DB_NAME, DB_PASSWORD: The database credentials
- DB_FORWARD_PORT: The port on which the database should be exposed (for connections outside of the Docker network)
- ADMINER_PORT: The port on which the Adminer is running