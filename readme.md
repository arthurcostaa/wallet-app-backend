# Wallet App API

## Intro

This and API created using Node.js, Express and PostgreSQL.
The main goal is to create an application that controls user finances.

## Requirements

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Documentation

Use Insomnia to import the file bellow:
https://github.com/arthurcostaa/wallet-app-backend/blob/main/insomnia.json

## Steps to run the project

1. Clone the project

```
git clone https://github.com/arthurcostaa/wallet-app-backend.git
```

2. Navigate to project folder and install dependencies

```
cd wallet-app-backend
npm install
```

3. Create a PostgreSQL on Docker

```
docker run \
--name postgres-finances \
-e POSTGRES_PASSWORD=docker \
-e POSTGRES_USER=docker \
- p 5432:5432 \
-d -t postgres
```

4. Create a .env file following the example:

```
PORT=3000
You can use for database
DB_URL=your_db_url

or

DB_URL=
DB_USER=docker
DB_PASSWORD=docker
DB_NAME=finances
DB_HOST=localhost
DB_PORT=5432
```

5. Run config script for create database and tables

```
npm run config:init
Observation: if do not stop press CTRL + C
```

6. Run the project in dev version:

```
npm run start:dev
```

7. Run the project in final version:

```
npm run start
```
