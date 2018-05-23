// Imports
const path = require("path");
const merge = require("webpack-merge");

// Plugins
const CleanWebpackPlugin = require("clean-webpack-plugin");

// Configs
const baseConfig = require("./webpack.config.base");
const PATHS = require("./paths.config");

// Webpack Production Configuration
const config = {
    output: {
        filename: "[name].[chunkhash].js"
    },
    devtool: "source-map",
    plugins: [new CleanWebpackPlugin([PATHS.build], {
            root: PATHS.root,
            verbose: false
        })]
};

module.exports = merge(baseConfig, config);
