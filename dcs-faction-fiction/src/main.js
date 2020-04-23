import Vue from 'vue'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)

import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  render: h => h(App),
}).$mount('#app')
