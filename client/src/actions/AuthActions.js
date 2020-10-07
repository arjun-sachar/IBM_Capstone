import Vue from "vue";
import router from "../router";
import AdminService from "../services/AdminService";
import store from "@/store";

const getCurrentUser = function(id) {
  return new Promise((resolve, reject) => {
    AdminService.getUser(id)
      .then(resp => {
        AdminService.getUserRoles(id).then(resp2 => {
          resp.data.roles = resp2.data.map(role => {
            return role.name;
          });
          resolve(resp);
        });
      })
      .catch(err => {
        reject("Invalid token");
      });
  });
};

export default {
  login(context, payload) {
    return new Promise((resolve, reject) => {
      if (payload.creds) {
        AdminService.loginUser(payload.creds.email, payload.creds.password)
          .then(resp => {
            let _payload = {
              userId: resp.data.userId,
              token: resp.data.id
            };
            context.commit("login_success", _payload);
            getCurrentUser(resp.data.userId)
              .then(user_resp => {
                _payload = {
                  currentUser: user_resp.data
                };
                context.commit("set_current_user", _payload);
                context.dispatch("get_system_alerts");
                context.dispatch("get_alerts");
                if (user_resp.data.roles.indexOf("admin") > -1) {
                  context.commit("set_admin");
                }
                resolve(payload);
                router.push(payload.redirectPath || "/");
              })
              .catch(err => {
                console.log("The error: ", err);
                reject(err);
                context.commit("logout");
              });
          })
          .catch(err => {
            console.log("The error: ", err);
            reject("Invalid username or password");
            store.commit("logout");
          });
      } else if (
        localStorage.getItem("user-id") &&
        localStorage.getItem("user-token")
      ) {
        getCurrentUser(localStorage.getItem("user-id"))
          .then(user_resp => {
            // If user is already logged in, no need to continue
            if (context.state.loggedIn) {
              resolve({});
              return;
            }
            const payload = {
              userId: localStorage.getItem("user-id"),
              token: localStorage.getItem("user-token")
            };
            context.commit("login_success", payload);
            const payload2 = {
              currentUser: user_resp.data
            };
            if (!sessionStorage.greetedUser) {
              Vue.notify({
                group: "global",
                type: "success",
                title: "Logged In",
                text: "Welcome back, " + payload2.currentUser.username + "!"
              });
              sessionStorage.greetedUser = true;
            }
            context.dispatch("get_system_alerts");
            context.dispatch("get_alerts");
            context.commit("set_current_user", payload2);
            if (user_resp.data.roles.indexOf("admin") > -1) {
              context.commit("set_admin");
            }
            resolve(payload);
          })
          .catch(err => {
            reject(err);
            console.log("The error: ", err);
            store.commit("logout");
          });
      } else {
        console.log("Error: Not logged in");
        reject("Not logged in");
      }
    });
  },
  logout(context) {
    Vue.notify({
      group: "global",
      title: "Logged Out",
      type: "warn"
    });
    AdminService.logoutUser().then(() => {
      context.commit("logout");
      router.push({
        name: "login"
      });
    });
  },
  update_temp_pass(context, payload) {
    context.commit("update_temp_pass", payload);
  }
};
