'use strict';
const {resolve} = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const postcssNested = require('postcss-nested');
const postcssVars = require('postcss-simple-vars');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: resolve(__dirname, 'build'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-rest-spread', ['component', [{
                        libraryName: 'element-ui',
                        styleLibraryName: 'theme-default'
                    }]]]
                },
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)\w*/,
                loader: 'file'
            }
        ]
    },
    target: 'electron-renderer',
    node: {
        __filename: true
    },
    vue: {
        loaders: {
            js: 'babel?{"presets":["es2015"],"plugins": ["transform-object-rest-spread", ["component", [{"libraryName": "element-ui","styleLibraryName":"theme-default"}]]]}',
            css: 'vue-style!css!postcss'
        }
    },
    postcss: function() {
        return [
            autoprefixer({
                browsers: ['last 5 versions']
            }),
            postcssNested(),
            postcssVars()
        ];
    },
    resolve: {
        root: [
            resolve(__dirname),
            resolve(__dirname, 'www')
        ],
        extensions: [
            '',
            '.js',
            '.vue'
        ],
        alias: {
            vue$: 'vue/dist/vue.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
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
