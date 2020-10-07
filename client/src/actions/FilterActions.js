import AdminService from "../services/AdminService";

export default {
  set_filters_loaded(context, payload) {
    context.commit("set_filters_loaded", payload);
  }
};
