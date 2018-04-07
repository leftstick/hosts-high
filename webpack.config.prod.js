const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/js/index.js'
  },
  mode: 'production',
  module: {
    rules: [
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
        use: ['babel-loader']
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
    chunkFilename: '[id].prod.js',
    filename: '[name].prod.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false
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
