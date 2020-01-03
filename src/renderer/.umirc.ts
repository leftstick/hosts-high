import { IConfig } from 'umi-types'

export default {
  hash: true,
  treeShaking: true,
  outputPath: '../../output',
  publicPath: './',
  history: 'hash',
  chainWebpack(config, { webpack }) {
    config
      .target('electron-renderer')
      .plugin('DefinePlugin')
      .use(webpack['DefinePlugin'], [
        {
          $dirname: '__dirname'
        }
      ])
  },
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: false,
        antd: true,
        routes: {
          exclude: [/model\.(j|t)sx?$/, /service\.(j|t)sx?$/, /hooks\//, /components\//, /services\//, /helpers\//]
        },
        locale: false,
        library: 'react',
        dynamicImport: {
          webpackChunkName: true,
          level: 2
        },
        title: false,
        pwa: false,
        hd: false,
        fastClick: false
      }
    ]
  ]
} as IConfig
