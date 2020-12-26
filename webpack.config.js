const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/public/dist');

module.exports = (env, argv) => ({
  devtool: 'source-map',
  mode: argv.mode,
  entry: {
    main: `${SRC_DIR}/components/React/App.tsx`,
  },
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
    sourceMapFilename: 'source.js.map',
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
  plugins: [new CleanWebpackPlugin()],
});
