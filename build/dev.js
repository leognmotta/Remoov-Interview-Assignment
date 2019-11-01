// @flow
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const rootPath = (url) => path.join(__dirname, '../', url);

module.exports = [
  {
    watch: true,
    mode: 'development',
    target: 'node',
    devtool: 'eval-source-map',
    externals: [nodeExternals()],
    entry: {Server: rootPath('src/Server.js')},
    output: {
      path: rootPath('tmp'),
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    plugins: [
      new NodemonPlugin({
        verbose: true,
        script: rootPath('tmp/Server.js'),
        watch: rootPath('tmp'),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ['@babel/preset-env', {targets: {node: 'current'}}],
                '@babel/preset-react',
              ],
              plugins: ['transform-flow-strip-types'],
            },
          },
        },
      ],
    },
  },
  {
    watch: true,
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {Website: rootPath('src/Website/index.js')},
    output: {
      path: rootPath('tmp/'),
      filename: '[name].js',
      publicPath: '/assets/',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.s?[ac]ss$/,
          use: ['iso-morphic-style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [
                  [
                    '@babel/preset-env',
                    {targets: {browsers: 'last 2 versions'}},
                  ],
                  '@babel/preset-react',
                ],
                plugins: [
                  'transform-class-properties',
                  'transform-flow-strip-types',
                ],
              },
            },
            'eslint-loader',
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|ico|jpg|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {limit: 8192, publicPath: '/assets/'},
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/Website/index.html',
        filename: 'index.html',
        chunks: ['Website'],
        favicon: './src/Website/assets/favicon.ico',
      }),
    ],
  },
];
