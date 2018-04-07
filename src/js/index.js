import ElementUI from 'element-ui'
import Vue from 'vue'
import hosts from './hosts'

import locale from 'element-ui/lib/locale/lang/en'

class App {
  constructor() {
    Vue.use(ElementUI, {
      locale
    })
    // eslint-disable-next-line
    Vue.config.devtools = __DEV__
  }

  destroySplash() {
    document.head.removeChild(document.querySelector('#splash-spinner'))
    document.body.removeChild(document.querySelector('.spinner'))
  }

  launch() {
    this.vue = new Vue({
      render: h => h(hosts)
    })
    this.vue.$mount('#application')
  }

  run() {
    this.destroySplash()
    this.launch()
  }
}

new App().run()
