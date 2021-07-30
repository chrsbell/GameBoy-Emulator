const path = require('path');

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/public/dist');

module.exports = (env, argv) => ({
  devtool: 'inline-source-map',
  mode: argv.mode,
  entry: {
    main: path.join(SRC_DIR, 'index.tsx'),
  },
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
    // sourceMapFilename: 'bundle.map',
    clean: true,
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
    modules: [
      path.resolve(SRC_DIR),
      path.resolve(SRC_DIR, 'components'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
});
