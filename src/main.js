import "./assets/style/common.less"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './local/i18n'
import { Popup,Toast,Dialog,Collapse, CollapseItem } from 'vant'
import ercMethods from "./utils/erc_methods"
import miningContract from "./utils/miningContract"
import common from "./utils/common"
import Http from './utils/Http'
import { BigNumber } from 'bignumber.js'
Vue.config.productionTip = false
import VueClipBoard from 'vue-clipboard2'
import { Notification,Slider,Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$notify = Notification;
Vue.use(VueClipBoard);
Vue.use(Popup).use(Collapse).use(CollapseItem).use(Slider).use(Loading.directive);
Vue.prototype.$toast = Toast
Vue.prototype.$alert = Dialog.alert
Vue.prototype.ercMethods = ercMethods
Vue.prototype.miningContract = miningContract
Vue.prototype.common = common
Vue.prototype.BigNumber = BigNumber
Vue.prototype.$http = Http

import filters from "./utils/filters"
Object.keys(filters).forEach(key => {
  Vue.prototype["$"+key] = filters[key]
  Vue.filter(key, filters[key])
})
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

