#!/usr/bin/env node

const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");
const { platformAsset, supportedAssets } = require("./platform");

const repo = process.env.GORSE_REPO || "gorse-io/gorse";
const version = process.env.GORSE_CLI_VERSION || `v${process.env.npm_package_version}`;
const downloadTimeoutMs = 120000;
const maxDownloadAttempts = 3;

function download(url, destination, redirects = 0) {
  return new Promise((resolve, reject) => {
    let settled = false;
    function finish(error) {
      if (settled) {
        return;
      }
      settled = true;
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }

    const request = https.get(
      url,
      {
        headers: {
          "user-agent": "gorse-cli-npm-package",
        },
        timeout: downloadTimeoutMs,
      },
      (response) => {
        if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
          if (redirects >= 5) {
            reject(new Error(`too many redirects while downloading ${url}`));
            return;
          }
          response.resume();
          download(response.headers.location, destination, redirects + 1).then(resolve, reject);
          return;
        }

        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`download failed: ${response.statusCode} ${response.statusMessage}`));
          return;
        }

        const expectedBytes = Number(response.headers["content-length"] || 0);
        let receivedBytes = 0;
        const file = fs.createWriteStream(destination, { mode: 0o755 });

        response.on("data", (chunk) => {
          receivedBytes += chunk.length;
          file.write(chunk);

          if (expectedBytes > 0 && receivedBytes >= expectedBytes) {
            response.destroy();
            file.end();
          }
        });
        response.on("end", () => file.end());
        response.on("error", (error) => {
          if (expectedBytes > 0 && receivedBytes >= expectedBytes) {
            file.end();
            return;
          }
          finish(error);
        });
        file.on("finish", () => {
          if (expectedBytes > 0 && receivedBytes !== expectedBytes) {
            finish(new Error(`incomplete download: expected ${expectedBytes} bytes, received ${receivedBytes}`));
            return;
          }
          finish();
        });
        file.on("error", finish);
      }
    );

    request.on("error", finish);

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
  const assets = process.argv.includes("--all") ? supportedAssets : [platformAsset()];
  const vendorDir = path.join(__dirname, "..", "vendor");
  fs.mkdirSync(vendorDir, { recursive: true });

  for (const asset of assets) {
    const url = `https://github.com/${repo}/releases/download/${version}/${asset.name}`;
    const destination = path.join(vendorDir, asset.name);
    const partialDestination = `${destination}.tmp`;

    if (fs.existsSync(destination) && fs.statSync(destination).size > 0) {
      console.log(`Using existing ${asset.name}.`);
      continue;
    }

    console.log(`Downloading ${asset.name} from ${repo} ${version}...`);
    fs.rmSync(partialDestination, { force: true });
    await downloadWithRetry(url, partialDestination);
    fs.renameSync(partialDestination, destination);
    fs.chmodSync(destination, 0o755);
  }
}

main().catch((error) => {
  console.error(`gorse-cli binary download failed: ${error.message}`);
  process.exit(1);
});
