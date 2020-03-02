import { defineConfig } from 'umi'

export default defineConfig({
  hash: true,
  outputPath: '../../output',
  publicPath: './',
  history: {
    type: 'hash'
  },
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
  plugins: ['@umijs/plugin-model', '@umijs/plugin-antd']
})
