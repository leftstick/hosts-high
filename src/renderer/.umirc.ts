import { defineConfig } from 'umi'

export default defineConfig({
  hash: true,
  outputPath: '../../output',
  publicPath: './',
  history: {
    type: 'hash',
  },
  title: 'Hosts Master',
  antd: {},
  // dynamicImport: {},
  // mfsu: {},
  // webpack5: {},
  chainWebpack(config, { webpack }) {
    config
      .target('electron-renderer')
      .plugin('DefinePlugin')
      .use(webpack['DefinePlugin'], [
        {
          $dirname: '__dirname',
        },
      ])
  },
})
