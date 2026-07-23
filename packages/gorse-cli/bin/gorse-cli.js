#!/usr/bin/env node

const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");

const PLATFORM_PACKAGE_BY_TARGET = {
  "x86_64-unknown-linux-gnu": "@gorse/gorse-cli-linux-x64",
  "aarch64-unknown-linux-gnu": "@gorse/gorse-cli-linux-arm64",
  "loongarch64-unknown-linux-gnu": "@gorse/gorse-cli-linux-loong64",
  "riscv64gc-unknown-linux-gnu": "@gorse/gorse-cli-linux-riscv64",
  "aarch64-apple-darwin": "@gorse/gorse-cli-darwin-arm64",
  "x86_64-pc-windows-msvc": "@gorse/gorse-cli-win32-x64",
  "aarch64-pc-windows-msvc": "@gorse/gorse-cli-win32-arm64",
};

const BINARY_BY_TARGET = {
  "x86_64-unknown-linux-gnu": "gorse-cli_linux_amd64",
  "aarch64-unknown-linux-gnu": "gorse-cli_linux_arm64",
  "loongarch64-unknown-linux-gnu": "gorse-cli_linux_loong64",
  "riscv64gc-unknown-linux-gnu": "gorse-cli_linux_riscv64",
  "aarch64-apple-darwin": "gorse-cli_darwin_arm64",
  "x86_64-pc-windows-msvc": "gorse-cli_windows_amd64.exe",
  "aarch64-pc-windows-msvc": "gorse-cli_windows_arm64.exe",
};

function targetTriple() {
  const targets = {
    linux: {
      x64: "x86_64-unknown-linux-gnu",
      arm64: "aarch64-unknown-linux-gnu",
      loong64: "loongarch64-unknown-linux-gnu",
      riscv64: "riscv64gc-unknown-linux-gnu",
    },
    darwin: {
      arm64: "aarch64-apple-darwin",
    },
    win32: {
      x64: "x86_64-pc-windows-msvc",
      arm64: "aarch64-pc-windows-msvc",
    },
  };
  return targets[process.platform]?.[process.arch] ?? null;
}

function findGorseCliExecutable() {
  const target = targetTriple();
  if (!target) {
    throw new Error(
      `Unsupported platform: ${process.platform} (${process.arch})`,
    );
  }

  const platformPackage = PLATFORM_PACKAGE_BY_TARGET[target];
  let vendorRoot;
  try {
    const packageJsonPath = require.resolve(`${platformPackage}/package.json`);
    vendorRoot = path.join(path.dirname(packageJsonPath), "vendor");
  } catch {
    vendorRoot = path.join(__dirname, "..", "vendor");
  }

  const binaryPath = path.join(vendorRoot, BINARY_BY_TARGET[target]);
  if (!existsSync(binaryPath)) {
    throw new Error(
      `Missing optional dependency ${platformPackage}. Reinstall gorse-cli: npm install -g gorse-cli@latest`,
    );
  }
  return binaryPath;
}

const child = spawn(findGorseCliExecutable(), process.argv.slice(2), {
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

function forwardSignal(signal) {
  if (child.killed) {
    return;
  }
  try {
    child.kill(signal);
  } catch {
    // Ignore failures while the child is already shutting down.
  }
}

const signalHandlers = new Map();
["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
  const handler = () => forwardSignal(signal);
  signalHandlers.set(signal, handler);
  process.on(signal, handler);
});

child.on("exit", (code, signal) => {
  if (signal) {
    signalHandlers.forEach((handler, forwardedSignal) => {
      process.removeListener(forwardedSignal, handler);
    });
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});
