const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const dotenv = require('dotenv');
const OfflinePlugin = require('offline-plugin');

dotenv.config();

const config = (env, argv) => {
  const envvars = argv.mode === 'production'
    ? {
      FACEBOOK_APP_ID: '377886075952790',
      FIREBASE_API_KEY: 'AIzaSyBOv2DwXdaQAXRiYbKmGol6w2LkN1dgG-c',
      FIREBASE_APP_ID: '1:993421901405:web:13a227cd708a2c415997b4',
      FIREBASE_AUTH_DOMAIN: 'lango-push-notifications.firebaseapp.com',
      FIREBASE_DATABASE_URL: 'https://lango-push-notifications.firebaseio.com',
      FIREBASE_MESSAGING_SENDER_ID: '993421901405',
      FIREBASE_PROJECT_ID: 'lango-push-notifications',
      FIREBASE_STORAGE_BUCKET: 'lango-push-notifications.appspot.com',
      FIREBASE_VAPID_KEY: 'BILWOBhZKiHFKvAqT_mldzu8vBG2Ow7g6YnLoV8pmtOuICtdYWvQsU4mlmM767EUndfpnXD7b921AvbOq65CeLc',
      GRAPHQL_ENDPOINT: 'https://zvuqq3epa5gr3gfgetdkffoqhq.appsync-api.eu-central-1.amazonaws.com/graphql',
      IDENTITY_POOL_ID: 'eu-central-1:4aece64b-4a79-4eeb-a989-dfb18ce79308',
      STORAGE_BUCKET: 'lango-prod-userdata',
    }
    : {
      FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_VAPID_KEY: process.env.FIREBASE_VAPID_KEY,
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
      IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    };
  for (const [key, value] of Object.entries(envvars)) {
    envvars[key] = JSON.stringify(value);
  }

  return {
    entry: './app/app.js',

    stats: 'minimal',

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js',
    },

    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
      publicPath: '/',
      public: 'localhost:4449',
      historyApiFallback: true,
    },

    devtool: argv.mode === 'production'
      ? 'source-map'
      : '#eval-source-map',

    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: path.resolve(__dirname, 'app', 'index.ejs'),
        filename: 'index.html',
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(new Date().toString()),
        'process.env': {
          NODE_ENV: JSON.stringify(argv.mode),
          ...envvars,
        },
      }),
      new UnusedWebpackPlugin({
        directories: [path.join(__dirname, 'app')],
        exclude: ['*.test.js', 'tests/setupTests.js'],
        failOnUnused: true,
        root: __dirname,
      }),
      new OfflinePlugin({
        publicPath: '/',
        ServiceWorker: {
          entry: path.resolve(__dirname, 'app', 'push-sw.js'),
          events: true, // For detecting SW updates at runtime installation in app.js
          minify: false, // Breaks build
        },
      }),
    ],

    module: {
      rules: [
        {
          test: /\.js(x?)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['@babel/preset-react'],
          },
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(ico|jpg|jpeg|png|gif|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        },
        {
          type: 'javascript/auto',
          test: /\.(json)/,
          exclude: /node_modules/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        },
      ],
    },

    resolve: {
      modules: ['app', 'node_modules'],
      extensions: [
        '.mjs',
        '.js',
        '.jsx',
      ],
    },
  };
};

module.exports = config;
