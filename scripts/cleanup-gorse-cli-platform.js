#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { PLATFORM_PACKAGES } = require("./gorse-cli-platforms");

const packageJsonPath = path.join(process.cwd(), "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (!PLATFORM_PACKAGES[packageJson.name]) {
  throw new Error(`unknown gorse-cli platform package: ${packageJson.name}`);
}
delete packageJson.os;
delete packageJson.cpu;
fs.writeFileSync(
  packageJsonPath,
  `${JSON.stringify(packageJson, null, 2)}
`,
);
