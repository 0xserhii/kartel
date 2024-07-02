# Welcome to Yieldlab!

Yieldlab is a SaaS platform which allows users to create their blockchain projects on our platform which just a few clicks.

We offer services like (not limited to those)

* Create Token Staking protocol (with `smart contract`)
* Create Token Staking protocol (without `smart contract`). This is a registered staking system using which users don't have to lock their tokens.
* Create Customizable UI for their frontend.
* More is coming...

# Run Project

The project is running on Node.js (`>=20.11`), NPM (`>=10.5`).
You may need to install node.js `v20` `lts`.

## Install dependencies
```bash
npm install
```

## Run on dev mode
```bash
npm run dev
```


# Project Structure

The backend is developed using `Express.js` framework using `Typescript`.
Every code is located in `/src`, and the `entrypoint` is `/src/index.ts`

## `/app.ts`
Initialize `express` app and apply `middlewares` to it.

## `/db.ts`
Initialize `Database` (mongoose), and connect to it.

## `/src/@types`
It contains the types which is accessible in `global` scope, like `process.env.`

## `/src/configs`
This is where project `configurations` are located.
Every `config` file name starts with its `scope` (e.g. `app.config.ts` for `app` config and `db.config.ts` for `database` config) and prefixed with `.config.ts`

## `/src/constants`
This is where we declare the `constants` which we will use throughout the project.
The same rule applies for file naming convention as `configs`.

## `/src/contracts`
This is where we keep our `smart contracts` which we will use throughout the project.
For now there is only one `smart contract` for `token staking` protocol.

## `/src/core`
This is where we keep our `core` module for our project.
E.G. `ApiError` interface which will be used for handling REST API's error.
`Logger` takes care of `logging` system in our project.
`Request` interface is used for parsing `API Request` with pre-defined `schema`

## `/src/guards`
This is where the `express.js` `guards` for authentication (`middleware`) is located.
E.g.
`authenticateCustomer.guard.ts`: Authenticate the `api` calller is a valid customer.
`authenticateMember.guard.ts`: Authenticate the `api` calller is a valid member.

## `/src/helpers`
`Helper` functions will be put here.
E.g.
`catchAsync`: Handles controllers error
`validator`: Functions for `validator` and its `schemas`

## `/src/interfaces`
This is where the `interfaces` of our project is defined.
Every `servie`, `model`, `controller`, .. references these `interfaces`


## `/src/middlewares`
Define `custom` `middlewares` like error handling, `cors` middleware, `rate-limit` middleware.

## `/src/models`
Keep database's `models`.

## `/src/queues`
Define `queues` to handle all transactions within our project.
We use `bullmq` (`redis` based queue system)

## `/src/routes`
All `Routes` available in our backend is defined here.

## `/src/schemas`
We define api `validators` as schema in here.
We are using [Joi](https://joi.dev/api/) for request `validation`.

## `/src/services`
We define all the `database-related` logics as `services` and keep them here.

## `/src/utils`
Define `utilies` used throughout our project.