# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/KirillDemyanenko/nodejs2023Q2-service.git
```

## Switch to containerization-database-orm branch

```
git checkout containerization-database-orm
```

## Installing NPM modules

```
npm install
```

## You need to run a command to start the container (Docker must run on your computer). It will download the necessary images and run the container

```
npm run docker-compose
```

## After starting the container, you can either run the application locally
```
npm run start
```
## Then you can run tests (You can also go into the image and run the tests there through the terminal)

```
npm run test
```

## To run only one of all test suites

```
npm run test -- <path to suite>
```
