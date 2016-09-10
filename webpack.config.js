const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');
const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app: path.join(__dirname, 'app'),

    style: [
        path.join(__dirname, 'node_modules', 'purecss'),
        path.join(__dirname, 'app', 'main.css')
    ],
    build: path.join(__dirname, 'build')
};
process.env.BABEL_ENV = TARGET;
const common = {
    module: {
        loaders: [
            {
              test: /\.jsx?$/,
              // Enable caching for improved performance during development
              // It uses default OS directory by default. If you need
              // something more custom, pass a path to it.
              // I.e., babel?cacheDirectory=<path>
              loaders: ['babel?cacheDirectory'],
              // Parse only app files! Without this it will go through
              // the entire project. In addition to being slow,
              // that will most likely result in an error.
              include: PATHS.app
          },
      ],
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                include: PATHS.app
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: {
        style: PATHS.style,
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    plugins: [new HtmlWebpackPlugin({title: 'Webpack demo'})]

}

var config;

switch (process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(common, {
            devtool: 'source-map',
            output: {
                path: PATHS.build,
                publicPath: '/webpackProductionReady/',
                filename: '[name].[chunkhash].js',
                // This is used for require.ensure. The setup
                // will work without but this is useful to set.
                chunkFilename: '[chunkhash].js'
            }
        }, parts.setFreeVariable('process.env.NODE_ENV', 'production'), parts.extractBundle({name: 'vendor', entries: ['react']}), parts.minify(), parts.clean(PATHS.build), parts.extractCSS(PATHS.style), parts.purifyCSS([PATHS.app]));
        break;
    default:
        config = merge(common, {
            devtool: 'eval-source-map'
        }, parts.setupCSS(PATHS.style), parts.devServer({
            // Customize host/port here if needed
            host: process.env.HOST,
            port: process.env.PORT
        }));
}

// Run validator in quiet mode to avoid output in stats
module.exports = validate(config, {quiet: true});
