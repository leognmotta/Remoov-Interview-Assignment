// @flow
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  mode: 'development',
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'inline-cheap-module-source-map',
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot|svg|ico|jpg|png|gif|scss|css|sass)(\?v=\d+\.\d+\.\d+)?$/,
        use: 'null-loader',
      },
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {targets: {node: 'current'}}],
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
    ],
  },
};
