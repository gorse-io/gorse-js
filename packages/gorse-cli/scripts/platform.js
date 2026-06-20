const supportedAssets = [
  { os: "darwin", arch: "arm64" },
  { os: "linux", arch: "amd64" },
  { os: "linux", arch: "arm64" },
  { os: "linux", arch: "loong64" },
  { os: "linux", arch: "riscv64" },
  { os: "windows", arch: "amd64" },
  { os: "windows", arch: "arm64" },
].map((asset) => {
  const extension = asset.os === "windows" ? ".exe" : "";
  return {
    ...asset,
    name: `gorse-cli_${asset.os}_${asset.arch}${extension}`,
  };
});

function platformAsset() {
  const platforms = {
    linux: "linux",
    darwin: "darwin",
    win32: "windows",
  };
  const archs = {
    x64: "amd64",
    arm64: "arm64",
    riscv64: "riscv64",
    loong64: "loong64",
  };

  const os = platforms[process.platform];
  const arch = archs[process.arch];
  if (!os || !arch) {
    throw new Error(`unsupported platform: ${process.platform}_${process.arch}`);
  }

  if (os === "darwin" && arch !== "arm64") {
    throw new Error("unsupported platform: darwin_amd64. Release builds currently include darwin_arm64 only.");
  }

  if (os === "windows" && arch !== "amd64" && arch !== "arm64") {
    throw new Error(`unsupported platform: windows_${arch}`);
  }

  const asset = supportedAssets.find((candidate) => candidate.os === os && candidate.arch === arch);
  if (!asset) {
    throw new Error(`unsupported platform: ${os}_${arch}`);
  }
  return asset;
}

module.exports = { platformAsset, supportedAssets };
