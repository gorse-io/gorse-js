# gorse.js

TypeScript SDK for Gorse recommender system.

[![CI](https://github.com/gorse-io/gorse-js/actions/workflows/ci.yml/badge.svg)](https://github.com/gorse-io/gorse-js/actions/workflows/ci.yml)
[![](https://img.shields.io/npm/v/gorsejs)](https://www.npmjs.com/package/gorsejs)
[![npm](https://img.shields.io/npm/dm/gorsejs)](https://www.npmjs.com/package/gorsejs)

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

```ts
import { Gorse } from "gorsejs";

const client = new Gorse({
  endpoint: "http://127.0.0.1:8088",
  secret: "gorse",
});

// Insert a user
await client.insertUser({
  UserId: "bob",
  Labels: { role: "dev", lang: "ts" },
  Comment: "frontend developer"
});

// Insert an item
await client.upsertItem({
  ItemId: "repo:vuejs/vue",
  Categories: ["framework", "frontend"],
  Labels: { stars: 100000 },
  Timestamp: "2024-01-01T00:00:00Z",
  Comment: "Vue.js repository"
});

// Insert feedback
await client.insertFeedbacks([
  { FeedbackType: "star", UserId: "bob", ItemId: "repo:vuejs/vue", Value: 1, Timestamp: "2024-01-02T00:00:00Z", Comment: "" },
  { FeedbackType: "star", UserId: "bob", ItemId: "repo:d3/d3", Value: 1, Timestamp: "2024-01-03T00:00:00Z", Comment: "" },
  { FeedbackType: "star", UserId: "bob", ItemId: "repo:moment/moment", Value: 1, Timestamp: "2024-01-04T00:00:00Z", Comment: "" }
]);

// Get recommendations
await client.getRecommend({ userId: "bob", cursorOptions: { n: 5 } });
```
