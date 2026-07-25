// Minimal webpack config used only for karma test bundling.
// The main build uses tsdown instead.
const path = require('path')
const webpack = require('webpack')
const pkg = require('../package.json')

module.exports = {
  mode: 'development',
  resolve: {
    symlinks: false,
    alias: {
      axios: path.resolve(__dirname, '../src/lib/empty.js'),
      micromark: path.resolve(__dirname, '../src/lib/micromark.js'),
    },
  },
  output: {
    library: 'roderuda',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../node_modules/luna-console'),
          path.resolve(__dirname, '../node_modules/luna-modal'),
          path.resolve(__dirname, '../node_modules/luna-tab'),
          path.resolve(__dirname, '../node_modules/luna-data-grid'),
          path.resolve(__dirname, '../node_modules/luna-object-viewer'),
          path.resolve(__dirname, '../node_modules/luna-dom-viewer'),
          path.resolve(__dirname, '../node_modules/luna-text-viewer'),
          path.resolve(__dirname, '../node_modules/luna-setting'),
          path.resolve(__dirname, '../node_modules/luna-box-model'),
          path.resolve(__dirname, '../node_modules/luna-notification'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /luna-dom-highlighter/,
        use: [
          {
            loader: 'css-loader',
            options: { esModule: false },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-prefixer')({ prefix: '_', ignore: [/luna-.*/] }),
                require('autoprefixer'),
                require('postcss-clean')(),
              ],
            },
          },
        ],
      },
      {
        test: /luna-dom-highlighter\.css$/,
        use: [{ loader: 'raw-loader', options: { esModule: false } }],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: '"' + pkg.version + '"',
      ENV: '"development"',
    }),
  ],
  devtool: 'source-map',
}
