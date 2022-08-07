# gorse.js

[![CI](https://github.com/gorse-io/gorse-js/actions/workflows/ci.yml/badge.svg)](https://github.com/gorse-io/gorse-js/actions/workflows/ci.yml)
![](https://img.shields.io/npm/v/gorsejs)


TypeScript SDK for Gorse recommender system.

## Install

- Install with npm:

```bash
npm install gorsejs
```
- Install with yarn:

```bash
yarn add gorsejs
```

## Usage

Create a client by the entrypoint and api key.

```js
import { Gorse } from "GorseJs";

const client = new Gorse({
  endpoint: "http://127.0.0.1:8087",
  secret: "api_key",
});
const reccomends = await client.getRecommend({userId: 'zhenghaoz'})
```
