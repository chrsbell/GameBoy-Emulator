const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
        test: /\.(ts|tsx)$/,
        exclude: [/\.test.ts$/, /\.test.tsx$/, /node_modules/],
        use: ['ts-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [/\.test.js$/, /\.test.jsx$/, /node_modules/],
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
  plugins: [new CleanWebpackPlugin()],
});
