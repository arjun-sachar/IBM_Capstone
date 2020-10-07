import Vue from "vue";
import Router from "vue-router";
import Home from "./views/demos/Home.vue";
import About from "./views/demos/About.vue";
import Admin from "./views/Admin.vue";
import Feedback from "./views/Feedback.vue";
import Login from "./views/Login.vue";
import FourOhFour from "./views/FourOhFour.vue";
import Upload from "./views/Upload.vue";
import Styling from "./views/demos/Styling.vue";
import Search from "./views/Search.vue";
import Analysis from "./views/Analysis.vue";

import store from "./store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true,
        inNav: true,
        icon: "home"
      }
    },
    {
      path: "/search",
      name: "Search",
      component: Search,
      meta: {
        requiresAuth: true,
        inNav: true,
        icon: "search"
      }
    },
    {
      path: "/analysis",
      name: "analysis",
      component: Analysis,
      meta: {
        requiresAuth: true,
        inNav: true,
        icon: "edit"
      }
    },
    {
      path: "/about",
      name: "about",
      component: About,
      meta: {
        requiresAuth: true,
        inNav: true,
        icon: "question"
      }
    },
    {
      path: "/styling",
      name: "styling",
      component: Styling,
      meta: {
        requiresAuth: true,
        inNav: true,
        icon: "login"
      }
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      meta: {
        requiresAdmin: true
      }
    },
    {
      path: "/feedback",
      name: "feedback",
      component: Feedback,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/upload",
      name: "upload",
      component: Upload,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/*",
      name: "404",
      component: FourOhFour
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (localStorage.getItem("user-token")) {
      store
        .dispatch("login", {
          redirectUrl: to.fullPath
        })
        .then(() => {
          if (store.state.isAdmin) {
            next();
          } else {
            next({
              name: "home"
            });
          }
        })
        .catch(() => {
          next({
            name: "login",
            params: {
              nextUrl: to.fullPath
            }
          });
          store.dispatch("logout");
        });
    } else {
      next({
        name: "login",
        params: {
          nextUrl: to.fullPath
        }
      });
    }
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("user-token")) {
      store
        .dispatch("login", {
          redirectUrl: to.fullPath
        })
        .then(() => {
          next();
        })
        .catch(() => {
          next({
            name: "login",
            params: {
              nextUrl: to.fullPath
            }
          });
          store.dispatch("logout");
        });
    } else {
      next({
        name: "login",
        params: {
          nextUrl: to.fullPath
        }
      });
    }
  } else {
    next();
  }
});

export default router;
