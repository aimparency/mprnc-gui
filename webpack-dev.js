const merge = require('webpack-merge')
const common = require('./webpack-common.js')

module.exports = merge(common, {
  mode: 'development', 
  watch: true,
  devtool: 'inline-source-map',
  /* how to manually choose file for resolving based on webpack config
  resolve: {
    alias: {
      shader: './build-shaders.dev.js'
    }
  }*/
})
