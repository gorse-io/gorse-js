#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { PLATFORM_PACKAGES } = require("./gorse-cli-platforms");

const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
);
const expectedTarget = PLATFORM_PACKAGES[packageJson.name];
if (!expectedTarget) {
  throw new Error(`unknown gorse-cli platform package: ${packageJson.name}`);
}
if (
  JSON.stringify(packageJson.gorseTarget) !== JSON.stringify(expectedTarget)
) {
  throw new Error(
    `invalid gorseTarget for ${packageJson.name}: ${JSON.stringify(
      packageJson.gorseTarget,
    )}`,
  );
}
