const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: resolve(__dirname, 'build'),
        filename: '[name].prod.js',
        chunkFilename: '[id].prod.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            js: 'babel-loader?{"presets":["es2015"],"plugins": ["transform-object-rest-spread", ["component", [{"libraryName": "element-ui","styleLibraryName":"theme-default"}]]]}',
                            css: 'vue-style-loader!css-loader!postcss-loader'
                        }
                    }
                }]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['es2015', {
                                modules: false
                            }]],
                            plugins: ['transform-object-rest-spread', ['component', [{
                                libraryName: 'element-ui',
                                styleLibraryName: 'theme-default'
                            }]]]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)\w*/,
                use: ['file-loader']
            }
        ]
    },
    target: 'electron-renderer',
    node: {
        __filename: true
    },
    resolve: {
        modules: [
            resolve(__dirname, 'node_modules'),
            resolve(__dirname),
            resolve(__dirname, 'www')
        ],
        extensions: [
            '.js',
            '.vue'
        ],
        alias: {
            vue$: 'vue/dist/vue.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: false
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.CommonsChunkPlugin('common.bundle.js'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: 'body',
            template: 'src/index.html',
            favicon: 'src/img/favicon.ico',
            hash: false
        })
    ]
};
