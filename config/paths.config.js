const path = require("path");

module.exports = {
    root: path.resolve(__dirname, ".."),
    config: path.resolve(__dirname),
    src: path.resolve(__dirname, "../src"),
    build: path.resolve(__dirname, "../dist"),
    modules: path.resolve(__dirname, "../node_modules")
};
