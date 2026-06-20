// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// zustand's ESM build (esm/middleware.mjs) uses import.meta.env.MODE which is
// Vite-specific and causes a SyntaxError in Metro's CJS output for web.
// Redirect zustand/* imports to their CJS builds (middleware.js) explicitly.
const prev = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('zustand/')) {
    const subPath = moduleName.slice('zustand/'.length);
    return {
      filePath: path.resolve(__dirname, 'node_modules', 'zustand', `${subPath}.js`),
      type: 'sourceFile',
    };
  }
  if (prev) {
    return prev(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
