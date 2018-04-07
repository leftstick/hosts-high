const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    historyApiFallback: false,
    host: '0.0.0.0',
    port: 8080
  },
  entry: {
    index: './src/js/index.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        test: /\.vue$/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              extractCSS: false,
              preserveWhitespace: false
            }
          }
        ]
      },
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)\w*/,
        use: ['file-loader']
      }
    ]
  },
  node: {
    __filename: true
  },
  output: {
    chunkFilename: '[id].bundle.js',
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true
    }),
    new HtmlWebpackPlugin({
      favicon: 'src/img/favicon.ico',
      filename: 'index.html',
      hash: false,
      inject: 'body',
      template: 'src/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [resolve(__dirname, 'node_modules'), resolve(__dirname), resolve(__dirname, 'www')]
  },

  target: 'electron-renderer'
}
