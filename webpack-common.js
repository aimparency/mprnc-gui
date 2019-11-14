var path = require('path') 

module.exports = {
  entry: './src/main.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env", "@babel/preset-react"] }
      },
      {
        test: /\.css$/,
        use: ["css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  output: {
    filename: 'mprnc-client.js', 
    path: path.resolve(__dirname, 'dist') 
  },
  context: __dirname
}
