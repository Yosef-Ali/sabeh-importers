module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // react-native-worklets/plugin MUST be last in the plugins list.
    // Required by react-native-reanimated v4+ (which NativeWind 4 uses
    // under the hood). In Reanimated 3 this was bundled; v4 split it
    // into the separate react-native-worklets package.
    plugins: ["react-native-worklets/plugin"],
  };
};
