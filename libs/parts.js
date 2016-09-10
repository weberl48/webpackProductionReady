const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');


const PurifyCSSPlugin = require('purifycss-webpack-plugin');
exports.devServer = function(options) {
    return {
        devServer: {
            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,
            hot: true,
            inline: true,
            // Display only errors to reduce the amount of output.
            stats: 'errors-only',
            // Parse host and port from env to allow customization.
            host: options.host, //Defualts to localhost
            port: options.port //Defaults to 8080
        },
        plugins: [// Enable multi-pass complication for enhanced perfomance in larger projects
            new webpack.HotModuleReplacementPlugin({multiStep: true})]
    };
}

exports.setupCSS = function(paths) {
    return {
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: [
                        'style', 'css'
                    ],
                    include: paths
                }
            ]
        }
    };
}

exports.minify = function() {
    return {
        plugins: [new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })]
    };
}

exports.setFreeVariable = function(key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [new webpack.DefinePlugin(env)]
    };
}

exports.extractBundle = function(options) {
    const entry = {};
    entry[options.name] = options.entries;
    return {
        // Define an entry point needed for splitting.
        entry: entry,
        plugins: [// Extract bundle and manifest files. Manifest is
            // needed for reliable caching.
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest']
            })]
    };
}

exports.clean = function(path) {
    return {
        plugins: [new CleanWebpackPlugin([path], {root: process.cwd()})]
    };
}
exports.extractCSS = function(paths) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  };
}

exports.purifyCSS = function(paths) {
  return {
    plugins: [
      new PurifyCSSPlugin({
          purifyOptions: { info: true, minify: true },
        basePath: process.cwd(),
        // `paths` is used to point PurifyCSS to files not
        // visible to Webpack. You can pass glob patterns
        // to it.
        paths: paths
      }),
    ]
  }
}
