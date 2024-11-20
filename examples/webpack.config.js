const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const TSCONFIG = path.resolve(__dirname, 'tsconfig.json');
const DIST_TSCONFIG = path.resolve(__dirname, 'tsconfig.dist.json');
const SRC = path.resolve(__dirname, '..', 'src');
const NODE_MODULES = path.resolve(__dirname, '..', 'node_modules');

module.exports = (env, argv) => {
  const prod = argv.mode === 'production';
  const pathPlugin = new TsConfigPathsPlugin({ configFile: prod ? DIST_TSCONFIG : TSCONFIG });

  return {
    mode: 'development',
    context: path.resolve(__dirname),

    entry: {
      'main/index-1': './main/index-1.ts',
      'main/index-2': './main/index-2.ts',
      'iframe-full/index': './iframe-full/index.ts',
      'iframe-lite/index': './iframe-lite/index.ts',
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, `dist`),
    },

    stats: prod ? 'errors-only' : { all: undefined },

    performance: prod && {
      maxEntrypointSize: 130 * 1024,
      hints: 'error',
    },

    resolve: {
      extensions: ['.ts', '.js'],
      modules: [__dirname, SRC, NODE_MODULES],
      plugins: [pathPlugin],
    },

    devServer: {
      port: 8080,
      static: __dirname,
    },

    module: {
      rules: [
        {
          enforce: 'pre',
          include: [__dirname, SRC],
          test: /\.js$/,
          use: 'source-map-loader',
        },
        {
          test: /\.(js|ts)$/,
          include: [__dirname, SRC],
          exclude: [/node_modules/],
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: TSCONFIG,
              },
            },
          ],
        },
      ],
    },

    devtool: 'source-map',
  };
};
