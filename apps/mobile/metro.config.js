const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Let Metro see the shared TS sources at the repo root. Without this,
// imports from `@sabeh/shared` resolve at type-check time (via tsconfig
// paths) but fail at bundle time — Metro only walks files under
// projectRoot by default.
config.watchFolders = [path.resolve(workspaceRoot, "packages")];

// Required for pnpm: dependencies live behind symlinks under `.pnpm/`,
// and Metro's default resolver follows real paths only.
config.resolver.unstable_enableSymlinks = true;

module.exports = withNativeWind(config, { input: "./global.css" });
