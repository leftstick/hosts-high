import { defineConfig } from '@umijs/max';
import { scripts, styles } from './splash';

export default defineConfig({
  history: {
    type: 'hash',
  },
  publicPath: 'auto',
  antd: {},
  access: false,
  model: {},
  initialState: false,
  request: false,
  outputPath: 'output',
  layout: false,
  title: 'Hosts Master',
  mfsu: {},
  routes: [
    {
      path: '/',
      redirect: '/hosts-master',
    },
    {
      name: '首页',
      path: '/hosts-master',
      component: './HostsMaster',
    },
  ],
  npmClient: 'pnpm',
  scripts,
  styles,
  chainWebpack(config) {
    config
      .target('electron22-renderer')
      .externals({
        electron: "require('electron')",
      })
      .end();
  },
});
