# FormMaker-be

Final Project 2024 - FormMaker

# Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version 18.12.0

# Getting started

- Clone the repository

```
git clone https://github.com/PBL7-2024-FormMaker/formmaker-be
```

- Install dependencies

```
npm install
```

- Run the project

```
npm run dev
```

Navigate to `http://localhost:3000`

## Apply Prisma Migrations:

```bash
npx prisma migrate dev
```

## Getting TypeScript

Add Typescript to project

```
npm install -D typescript
```

## Project Structure

The folder structure of this app is explained below:

| Name                | Description                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **dist**            | Contains the distributable (or output) from your TypeScript build.                               |
| **node_modules**    | Contains all npm dependencies                                                                    |
| **src**             | Contains source code that will be compiled to the dist dir                                       |
| **src/controllers** | Controllers define functions to serve various express routes.                                    |
| **src/middlewares** | Express middlewares which process the incoming requests before handling them down to the routes  |
| **src/routes**      | Contain all express routes, separated by module/area of application                              |
| **src/models**      | Models define schemas that will be used in storing and retrieving data from Application database |
| **src**/index.ts    | Entry point to express app                                                                       |
