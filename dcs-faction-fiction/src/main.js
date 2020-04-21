import Vue from 'vue'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader

import App from './App.vue'

Vue.use(VueMaterial)
Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326',
})

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  render: h => h(App),
}).$mount('#app')
