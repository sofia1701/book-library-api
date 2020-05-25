# MySQL Book Library API

This repository contains the integration test suite for Book Library API challenge.

### Install
- Fork this repository
- `git clone git@github.com:<your-github-username>/book-library-api.git`
- `cd book-library-api`
- `npm install`

### Running the Tests
This setup assumes that you are running `MySql` on in Docker.

## Setting up the database

This project requires a running MySQL database. To set one up with Docker, run:

```
docker run -d -p 3306:3306 --name book_library_api -e MYSQL_ROOT_PASSWORD=<PASSWORD> mysql
```
To start the database, run:

```
docker start book_library_api
```

To stop the database, run:

```
docker stop book_library_api
```

The `create-database` and `drop-database` scripts will run automatically before and after your tests to handle database setup/teardown/

Create a new file in the project root called `.env.test` and add the database connection details as set out in `.env.example`.


- `npm test` uses [Mocha](https://mochajs.org/) and [Supertest](https://www.npmjs.com/package/supertest) to run e2e tests defined in `tests` directory

### Running the API

Create a new file in the project root called `.env` and add your environment variables, as set out in `.env.example`.

Make sure the DBNAME in you `.env.test` has a different name.

You can then fire up the API with `npm start`.