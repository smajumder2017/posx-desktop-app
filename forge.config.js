const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
let { noAsar } = require('process');
noAsar = true;
function getEnvFile() {
  const platform = os.platform();
  return `apps/backend/env/.env.${platform}`;
}

function getOutputPath() {
  const platform = os.platform();
  switch (platform) {
    case 'darwin': {
      return path.join(
        __dirname,
        `out/posx-${process.platform}-${process.arch}/posx.app/Contents/Resources/app`,
      );
    }
    case 'win32': {
      return path.join(
        __dirname,
        `out/posx-${process.platform}-${process.arch}/resources/app`,
      );
    }

    default:
      break;
  }
}

module.exports = {
  // packagerConfig: {
  //   asar: true
  // },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // asar: false
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  // plugins: [
  //   {
  //     name: '@electron-forge/plugin-auto-unpack-natives',
  //     config: {},
  //   },
  //   // Fuses are used to enable/disable various Electron functionality
  //   // at package time, before code signing the application
  //   new FusesPlugin({
  //     version: FuseVersion.V1,
  //     [FuseV1Options.RunAsNode]: false,
  //     [FuseV1Options.EnableCookieEncryption]: true,
  //     [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
  //     [FuseV1Options.EnableNodeCliInspectArguments]: false,
  //     [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
  //     [FuseV1Options.OnlyLoadAppFromAsar]: false,
  //   }),
  // ],
  packagerConfig: {
    ignore: [
      '/apps/backend/prisma/posx.db',
      /^\/(src|test|out)/,
      /^\/apps\/backend\/(src|test|out)/,
      /^\/apps\/frontend\/(src|test|out)/,
      /^\/node_modules\/backend($|\/)/,
      /^\/node_modules\/frontend($|\/)/,
      /^\/node_modules\/electron($|\/)/,
      /^\/node_modules\/\.bin($|\/)/,
      /^\/node_modules\/\.cache($|\/)/,
      /^\/node_modules\/debug($|\/)/,
      /^\/node_modules\/electron-debug($|\/)/,
      /^\/node_modules\/electron-devtools-installer($|\/)/,
      /^\/node_modules\/electron-edge-js($|\/)/,
      /^\/node_modules\/electron-packager($|\/)/,
      /^\/node_modules\/electron-winstaller($|\/)/,
      /^\/node_modules\/\.pnp($|\/)/,
      /^\/node_modules\/\.s?css-cache($|\/)/,
      /^\/node_modules\/\.shrinkwrap.yaml$/,
    ],
  },
  hooks: {
    packageAfterCopy: async (
      forgeConfig,
      buildPath,
      electronVersion,
      platform,
      arc,
    ) => {
      console.log(buildPath, electronVersion, platform, arc);

      // const output = path.join(
      //   __dirname,
      //   `out/posx-${process.platform}-${process.arch}/posx.app/Contents/Resources/app`,
      // );
      // fs.cpSync(envPath, output, );
    },
    postPackage: async (forgeConfig, options) => {
      const srcNodeModules = path.join(__dirname, 'node_modules');
      const output = getOutputPath();
      const destNodeModules = path.join(output, 'node_modules');

      fs.cpSync(srcNodeModules, destNodeModules, { recursive: true });
      // const envPath = path.join(__dirname, getEnvFile());
      // fs.copyFileSync(envPath, output + '/apps/backend/.env');
      execSync(`npm --prefix ${output} prune --production`);
    },
  },
};
