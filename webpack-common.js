const path = require('path') 
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'mprnc.js', 
    path: path.resolve(__dirname, 'dist') 
  },
  module: {
    rules: [
      {
        test: /\.vue$/, 
        loader: 'vue-loader' 
      }, 
      {
        test: /\.css$/,
        use: [
          'vue-style-loader', 
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ], 
  context: __dirname
}
