var path = require('path');
var SRC_DIR = path.join(__dirname, '/client/src');
var DIST_DIR = path.join(__dirname, '/public/dist');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = (env, argv) => {
  return {
    devtool: 'source-map',
    mode: argv.mode,
    entry: {
      main: `${SRC_DIR}/index.js`,
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
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
    },
    plugins: [new CleanWebpackPlugin()],
  };
};
