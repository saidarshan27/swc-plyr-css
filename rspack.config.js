const path = require("path");
const rspack = require('@rspack/core');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: './src/javascripts/index/index.js',
  output: {
    filename: "main.[contenthash].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new rspack.CssExtractRspackPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[name].[contenthash].css'
    }),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [rspack.CssExtractRspackPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [rspack.CssExtractRspackPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.js(x)?$/,
        exclude:
          /node_modules/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: "ecmascript",
                  jsx: true,
                },
                transform: {
                  react: {
                    pragma: 'React.createElement',
                    pragmaFrag: 'React.Fragment',
                    throwIfNamespace: true,
                    development: false,
                    useBuiltins: false
                  }
                },
              },
            }
          },
        ],
      }
    ]
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      // name: config.env !== 'production',
      name: false,
      // increase it if u want duplicate free bundle, but number of request may increase resulting in more overhead of request of js files. Think Wise!
      maxInitialRequests: 25,
      maxAsyncRequests: 25,
    },
  },
};