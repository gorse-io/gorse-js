#!/usr/bin/env node

const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");
const { PLATFORM_PACKAGES } = require("./gorse-cli-platforms");

const supportedAssets = new Set(
  Object.values(PLATFORM_PACKAGES).map((target) => target.asset),
);
const repo = process.env.GORSE_REPO || "gorse-io/gorse";
const version =
  process.env.GORSE_CLI_VERSION || `v${process.env.npm_package_version}`;
const downloadTimeoutMs = 120000;
const maxDownloadAttempts = 3;

function download(url, destination, redirects = 0) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: { "user-agent": "gorse-cli-npm-package" },
        timeout: downloadTimeoutMs,
      },
      (response) => {
        if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
          response.resume();
          if (redirects >= 5 || !response.headers.location) {
            reject(new Error(`too many redirects while downloading ${url}`));
            return;
          }
          const redirectUrl = new URL(
            response.headers.location,
            url,
          ).toString();
          download(redirectUrl, destination, redirects + 1).then(
            resolve,
            reject,
          );
          return;
        }

        if (response.statusCode !== 200) {
          response.resume();
          reject(
            new Error(
              `download failed: ${response.statusCode} ${response.statusMessage}`,
            ),
          );
          return;
        }

        const expectedBytes = Number(response.headers["content-length"] || 0);
        let receivedBytes = 0;
        const file = fs.createWriteStream(destination, { mode: 0o755 });
        response.on("data", (chunk) => {
          receivedBytes += chunk.length;
        });
        response.on("error", reject);
        file.on("error", reject);
        file.on("finish", () => {
          if (expectedBytes > 0 && receivedBytes !== expectedBytes) {
            reject(
              new Error(
                `incomplete download: expected ${expectedBytes} bytes, received ${receivedBytes}`,
              ),
            );
            return;
          }
          resolve();
        });
        response.pipe(file);
      },
    );

    request.on("error", reject);
    request.on("timeout", () => {
      request.destroy(new Error(`download timed out: ${url}`));
    });
  });
}

async function downloadWithRetry(url, destination) {
  for (let attempt = 1; attempt <= maxDownloadAttempts; attempt += 1) {
    try {
      await download(url, destination);
      return;
    } catch (error) {
      fs.rmSync(destination, { force: true });
      if (attempt === maxDownloadAttempts) {
        throw error;
      }
      console.log(`Retrying download after failure: ${error.message}`);
    }
  }
}

async function main() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const target = packageJson.gorseTarget;
  const expectedTarget = PLATFORM_PACKAGES[packageJson.name];
  const asset = target?.asset;
  if (
    !expectedTarget ||
    JSON.stringify(target) !== JSON.stringify(expectedTarget) ||
    !supportedAssets.has(asset)
  ) {
    throw new Error(`invalid gorseTarget for ${packageJson.name}`);
  }
  if (!target.os || !target.cpu) {
    throw new Error("gorseTarget.os and gorseTarget.cpu are required");
  }
  if (!process.env.npm_package_version && !process.env.GORSE_CLI_VERSION) {
    throw new Error("npm_package_version or GORSE_CLI_VERSION is required");
  }

  const vendorDir = path.join(process.cwd(), "vendor");
  const destination = path.join(vendorDir, asset);
  const partialDestination = `${destination}.tmp`;
  const url = `https://github.com/${repo}/releases/download/${version}/${asset}`;

  fs.mkdirSync(vendorDir, { recursive: true });
  fs.rmSync(partialDestination, { force: true });
  console.log(`Downloading ${asset} from ${repo} ${version}...`);
  await downloadWithRetry(url, partialDestination);
  fs.renameSync(partialDestination, destination);
  fs.chmodSync(destination, 0o755);

  // Yarn 1 validates every workspace against the host platform, so platform
  // packages keep their target metadata in gorseTarget while in the monorepo.
  // Add the standard npm selectors only after the binary is ready to pack.
  packageJson.os = [target.os];
  packageJson.cpu = [target.cpu];
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
}

main().catch((error) => {
  console.error(`gorse-cli binary download failed: ${error.message}`);
  process.exit(1);
});
