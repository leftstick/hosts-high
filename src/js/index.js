import Vue from 'vue';
import ElementUI from 'element-ui';
import hosts from './hosts';

import 'element-ui/lib/theme-default/index.css';
import locale from 'element-ui/lib/locale/lang/en';

class App {

    constructor() {
        Vue.use(ElementUI, {
            locale
        });
        //eslint-disable-next-line
        Vue.config.devtools = __DEV__;
    }

    createVueOpts() {
        this.vueOps = {
            components: {
                hosts
            }
        };
    }

    destroySplash() {
        document.head.removeChild(document.querySelector('#splash-spinner'));
        document.body.removeChild(document.querySelector('.spinner'));
    }

    launch() {
        new Vue(this.vueOps).$mount('#application');
    }

    run() {
        this.createVueOpts();
        this.destroySplash();
        this.launch();
    }

}

new App().run();
