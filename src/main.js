import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import * as VueGoogleMaps from 'vue2-google-maps';
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueTheMask from 'vue-the-mask'

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBXXcW4ID60qCzHT0wnXX4mhAFADe9RXiw',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    region: 'AR',
    language: 'ES',
  },
})
Vue.use(VueTheMask)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
