const {
  override,
  disableEsLint,
  addDecoratorsLegacy,
  fixBabelImports,
  addLessLoader,
} = require('customize-cra');

/* config-overrides.js */
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#FA541D',
    },
    modules: {
      localIdentName: '[local]--[hash:base64:5]',
    },
  }),
  addDecoratorsLegacy(),
  disableEsLint(),
);
