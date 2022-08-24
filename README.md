# AV api

Api for an av website written in typescript with fastify.

## Setup

```bash
cp temp.env .env
```

Then fill in the required values in .env.

Note that an s3 bucket and a cloudfront endpoint is required.

## Build

```bash
yarn build
```

## Start

```bash
yarn start
```

Or build a docker image using the Dockerfile and then specify env variables for the container when starting.

## Api docs

Read `docs` directory.

## License

MIT License. This software can be released by me because it was solely written by me.
THe frontend cannot be released due to copyright problems.
