import Vue from 'vue';
import VueRouter from 'vue-router'
import store from './store/index';

Vue.use(VueRouter)
Vue.config.productionTip = false

import App from './App.vue'
import TableCars from './components/TableCars/TableCars.vue';
import FormCars from './components/FormCars/FormCars.vue';

const routes = [
  { path: '/table', component: TableCars },
  { path: '/form', component: FormCars }
]

const router = new VueRouter({
  routes
})

new Vue({
  render (h) { return h(App) },
  router,
  store
}).$mount('#app');
