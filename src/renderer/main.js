import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';


import db from './datastore';

// eslint-disable-next-line import/first
import ElementUI from 'element-ui'; // 新添加
// eslint-disable-next-line import/first
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI); // 新添加

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.prototype.$db = db;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
