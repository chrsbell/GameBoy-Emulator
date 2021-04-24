const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/public/dist');

module.exports = (env, argv) => ({
  devtool: 'source-map',
  mode: argv.mode,
  entry: {
    main: path.join(SRC_DIR, 'index.tsx'),
  },
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.map',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: [
          /\.test.js$/,
          /\.test.jsx$/,
          /\.test.ts$/,
          /\.test.tsx$/,
          /node_modules/,
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx'],
  },
  plugins: [new CleanWebpackPlugin()],
});
