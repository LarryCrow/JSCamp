import Vue from 'vue';
import VueRouter from 'vue-router'
import Vuex from 'vuex';
import store from './store';

Vue.use(Vuex);
Vue.use(VueRouter)
Vue.config.productionTip = false

import App from './App.vue'
import TableCars from './components/TableCars/TableCars.vue';
import FormCars from './components/FormCars/FormCars.vue';
import Auth from './components/Auth/Auth.vue';
import ErrorModal from './utils/ErrorModal/ErrorModal.vue';
import NotificationModal from './utils/NotificationModal/NotificationModal.vue';

Vue.component('error-modal', ErrorModal);
Vue.component('notif-modal', NotificationModal);

const routes = [
  { path: '/table', component: TableCars },
  { path: '/form*', component: FormCars },
  { path: '/auth', component: Auth},
  { path: '*', redirect: '/table' }
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store,
  render (h) { return h(App) },
}).$mount('#app');
