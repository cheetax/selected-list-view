const path = require('path');
//const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: [
    './src/lib/index.js'
  ],
  output: {
    path: path.resolve ('dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "selected-list-view.css",
      chunkFilename: "selected-list-view.css"
    }),
    // new HtmlWebPackPlugin({
    //   template: "./public/index.html",
    //   filename: "./index.html"
    // })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        //include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", { "modules": false }],
              "@babel/preset-react"
            ],
            plugins: [
              [
                "@babel/plugin-proposal-decorators",
                {
                  "legacy": true
                }
              ],
              //"transform-decorators-legacy",
              "@babel/plugin-proposal-class-properties",

              ["@babel/plugin-transform-runtime", {
                "helpers": true,
                "regenerator": false
              }],
              "react-hot-loader/babel"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      },
    ],

  },
  //plugins: [htmlWebpackPlugin],

  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    },

  }
};