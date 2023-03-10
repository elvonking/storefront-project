# Storefront Backend Postgres API :

## Introduction ##

This is a REST API simulating the cart functionalities designed with models and handlers tied with endpoints for specific behaviours. A detailed list of actions, schema and endpoint is available in REQUIREMENTS.md.

---
## Setup ##

### Database config ###

The API backend connects with postgreSQL database, two databases are created, one for development and the second for the tests, also psql cli is required :

```SQL
CREATE DATABASE storefront;
CREATE DATABASE storefront_test;
````
Note: User must have an access to use the database.

Example of the required `database.json` file could be, please note this must not be inside your code for security:

```json
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront",
    "user": "postgres",
    "password": "postgres"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront_test",
    "user": "postgres",
    "password": "postgres"
  }
}
```

### Environment variables ###

**IMPORTANT: .env is required  and must be inside .git ignore for security.**

Example for the required `.env` could be as below and the values can be accessed by **_dotenv_** pkg:.
```dotenv
ENV=dev
PORT=3000

DATABASE_HOST=127.0.0.1  
DATABASE_PORT=5432
DATABASE_NAME=storefront
DATABASE_NAME_TEST=storefront_test
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

BCRYPT_PASSWORD=speak-friend-and-enter
SALT_ROUNDS=10
TOKEN_SECRET=token-secret
PEPPER=this-is-the-pepper-strings
```
**PEPPER**: a string used from bcrypt to hash.

**TOKEN_SECRET**: a string JWT will use it to generate tokens.

**SALT_ROUNDS**: rounds will be used from the hashing functionality by bcrypt.

**BCRYPT_PASSWORD**: is a password used in hashing to generate not crackable password in the database.

## Getting Started ##

### Installing required dependencies ###

### install dependencies ###
`npm install` or `yarn` 

### Apply migrations and migrate to form the database shape. ###
`npx db-migrate up`  

### Running the server ###

`yarn start` then the API will work on `127.0.0.1:3000` 

### Release port 3000 if needed: Unix based OS ###
`pkill -9 node`
### Scripts ###

#### Transpile from JS to TS ####

`yarn build`

The JS transpiled code will be in  `\dist` folder.

#### Testing ####

`yarn test` will apply the migration in the database **_storefront_test_** and form the schema as well run the tests.

#### Formatting ####

Prettier is used for applying formatting rules, please see =>  `.prettierrc`file for more.

`yarn prettier`

#### Linting ####

ESlint is used for correcting the formatting problems, check `.eslintrc` for more inf or change by your own.


`npm run lint`

---
