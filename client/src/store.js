import Vue from "vue";
import Vuex from "vuex";
import AuthMutations from "@/mutations/AuthMutations";
import AuthActions from "@/actions/AuthActions";
import SystemAlertActions from "@/actions/SystemAlertActions";
import SystemAlertMutations from "@/mutations/SystemAlertMutations";
import AlertActions from "@/actions/AlertActions";
import AlertMutations from "@/mutations/AlertMutations";
import FilterActions from "@/actions/FilterActions";
import FilterMutations from "@/mutations/FilterMutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    currentUser: null,
    isAdmin: false,
    systemAlerts: [],
    showAlerts: false,
    alerts: [],
    filtersLoaded: false
  },
  mutations: {
    ...AuthMutations,
    ...SystemAlertMutations,
    ...AlertMutations,
    ...FilterMutations
  },
  actions: {
    ...AuthActions,
    ...SystemAlertActions,
    ...AlertActions,
    ...FilterActions
  }
});
