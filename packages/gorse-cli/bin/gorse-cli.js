#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { platformAsset } = require("../scripts/platform");

const binaryPath = path.join(__dirname, "..", "vendor", platformAsset().name);
const result = spawnSync(binaryPath, process.argv.slice(2), { stdio: "inherit" });

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
