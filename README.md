# MIS-Analytics-service

Service that handles authentication and storage of config files for MIS-Analytics.

# How to run this service locally:

## Using node

First create an .env file with the neede variables to connect to your mongoDB instance and JWT secret.

```
MONGODB_URI=mongodburishowninconnectsettings
JWT_SECRET='SUPERSECRET'
PORT=4000
```

## Or just use docker compose

Replace the variables in docker-compose.yml file and:

```
docker compose up -d
```

You can access the service at the port defined in docker-compose.yml (default: 4000).
