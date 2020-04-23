import Vue from 'vue'

import { MdField, MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(MdField)
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)

import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  render: h => h(App),
}).$mount('#app')
