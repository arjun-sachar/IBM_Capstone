import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Antd from "ant-design-vue";
import VueCookies from "vue-cookies";
import Notifications from "vue-notification";
import "./assets/style.less";

Vue.use(Antd);
Vue.use(Notifications);
Vue.use(VueCookies);

Vue.config.productionTip = false;

// CUSTOM DIRECTIVE
Vue.directive('theme', {
  bind(el, binding, vnode) {
    if (this.binding.value == 21) {
      el.style.maxWidth = "400px"
    }
  }
})

// Filters
Vue.filter('to-uppercase', function(value){
  return value.toUpperCase();
});

Vue.filter('shorten', function(value) {
  return value.slice(0,100) + '...'; 
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
