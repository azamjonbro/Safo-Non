const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true, 
  lintOnSave: false, 

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      })
    ]
  },

  devServer: {
    port: 8080, 
    open: true, 
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend API manzili
        changeOrigin: true
      }
    }
  }
});
