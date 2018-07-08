const path = require('path');
const utils = require('./utils');

const createLintingRule = () => ({
  test: /\.(js|jsx)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [
    utils.resolve('src'),
    utils.resolve('examples'),
    utils.resolve('test')
  ],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: true,
  },
});

const filename = process.env.NODE_ENV === 'production' ? 'min.' : (process.env.NODE_ENV === 'common' ? 'common.' : '');
const _target = process.env.NODE_ENV === 'common' ? 'commonjs2' : 'umd2';

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    '{{ name }}': path.resolve(__dirname, '../index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `[name].${filename}js`,
    libraryTarget: _target
  },
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
    ],
    alias: {
      'src': utils.resolve('src')
    }
  },
  module: {
    rules: [
      ...([createLintingRule()] || []),
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        include: [
          utils.resolve('src'),
          utils.resolve('examples'),
          utils.resolve('test'),
        ],
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: ['react-hot-loader/babel'],
            }
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        include: [
          utils.resolve('src'),
          utils.resolve('examples'),
          utils.resolve('test'),
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      }
    ],
  },
  node: {
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
