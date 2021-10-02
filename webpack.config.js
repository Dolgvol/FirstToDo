const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./src/index.js",
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [           
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ]
    },
    resolve: {
        alias: {
            "@": path.join(__dirname, 'src/js'),
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'app.css',
        }),
        new CleanWebpackPlugin(),
    ],
}
