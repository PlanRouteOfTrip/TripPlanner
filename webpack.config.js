const path = require("path");

module.exports = {
  entry: ["babel-polyfill", "./src/app.js"],
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "./dist/main.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
