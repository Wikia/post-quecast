const path = require('path');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const TSCONFIG = path.resolve(__dirname, 'tsconfig.json');
const DIST_TSCONFIG = path.resolve(__dirname, 'tsconfig.dist.json');
const SRC = path.resolve(__dirname, '..', 'src');
const NODE_MODULES = path.resolve(__dirname, '..', 'node_modules');

const config = ({ name, prod, performance, entry }) => {
  const pathPlugin = new TsConfigPathsPlugin({ configFileName: prod ? DIST_TSCONFIG : TSCONFIG });

  return {
    mode: 'development',
    context: path.resolve(__dirname, name),
    entry,

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, `dist`, name),
    },

    stats: prod ? 'errors-only' : { all: undefined },
    performance,

    devServer: {
      port: 8080,
      inline: false,
      contentBase: __dirname,
    },

    resolve: {
      extensions: ['.ts', '.js'],
      modules: [__dirname, SRC, NODE_MODULES],
      plugins: [pathPlugin],
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
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: TSCONFIG,
              },
            },
          ],
        },
      ],
    },

    devtool: 'source-map',
  };
};

module.exports = (env, argv) => {
  const prod = argv.mode === 'production';
  const apps = {
    main: {
      performance: prod && {
        maxEntrypointSize: 39.5 * 1024,
        hints: 'error',
      },
      entry: {
        'index-1': './index-1.ts',
        'index-2': './index-2.ts',
      },
    },
    'iframe-full': {
      performance: prod && {
        maxEntrypointSize: 38.5 * 1024,
        hints: 'error',
      },
      entry: {
        index: './index.ts',
      },
    },
    'iframe-lite': {
      performance: prod && {
        maxEntrypointSize: 6.5 * 1024,
        hints: 'error',
      },
      entry: {
        index: './index.ts',
      },
    },
  };

  return Object.keys(apps)
    .map((name) => ({ name, value: apps[name] }))
    .map(({ name, value }) =>
      config({ name, prod, performance: value.performance, entry: value.entry }),
    );
};
