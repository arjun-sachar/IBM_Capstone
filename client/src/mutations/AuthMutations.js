export default {
  login_success(state, payload) {
    localStorage.setItem("user-id", payload.userId);
    localStorage.setItem("user-token", payload.token);
    state.loggedIn = true;
  },
  set_current_user(state, payload) {
    state.currentUser = payload.currentUser;
  },
  set_admin(state) {
    state.isAdmin = true;
  },
  logout(state) {
    localStorage.removeItem("user-id");
    localStorage.removeItem("user-token");
    state.loggedIn = false;
    state.isAdmin = false;
    state.currentUser = null;
  },
  update_temp_pass(state, payload) {
    state.currentUser.temp_pass = payload;
  }
};
