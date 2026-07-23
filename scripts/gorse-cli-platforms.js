const PLATFORM_PACKAGES = {
  "@gorse/gorse-cli-linux-x64": {
    os: "linux",
    cpu: "x64",
    asset: "gorse-cli_linux_amd64",
  },
  "@gorse/gorse-cli-linux-arm64": {
    os: "linux",
    cpu: "arm64",
    asset: "gorse-cli_linux_arm64",
  },
  "@gorse/gorse-cli-linux-loong64": {
    os: "linux",
    cpu: "loong64",
    asset: "gorse-cli_linux_loong64",
  },
  "@gorse/gorse-cli-linux-riscv64": {
    os: "linux",
    cpu: "riscv64",
    asset: "gorse-cli_linux_riscv64",
  },
  "@gorse/gorse-cli-darwin-arm64": {
    os: "darwin",
    cpu: "arm64",
    asset: "gorse-cli_darwin_arm64",
  },
  "@gorse/gorse-cli-win32-x64": {
    os: "win32",
    cpu: "x64",
    asset: "gorse-cli_windows_amd64.exe",
  },
  "@gorse/gorse-cli-win32-arm64": {
    os: "win32",
    cpu: "arm64",
    asset: "gorse-cli_windows_arm64.exe",
  },
};

module.exports = { PLATFORM_PACKAGES };
