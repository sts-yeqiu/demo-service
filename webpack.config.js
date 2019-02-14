var nodeExternals = require('webpack-node-externals');
const path = require('path');


module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src/index.ts'),
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader',
        }]
    },
    plugins: [
       
    ]
};