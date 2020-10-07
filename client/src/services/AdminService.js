import HTTP from "./HTTP";
const SESSION_EXPR = 18000;

export default {
  // Meta
  getModels() {
    return HTTP().get("/api/meta/models");
  },
  getSwagger() {
    return HTTP().get("/explorer/swagger.json");
  },
  getConfig() {
    return HTTP().get("/config");
  },
  // Users
  getAllUsers() {
    return HTTP().get("/api/users/");
  },
  getUser(userId) {
    return HTTP().get(`/api/users/${userId}`);
  },
  getUserRoles(userId) {
    return HTTP().get(`/api/users/${userId}/roles`);
  },
  loginUser(email, password) {
    return HTTP().post("/api/users/login", {
      email,
      password,
      ttl: 1800 // time to live in seconds (15 min is default)
    });
  },
  logoutUser() {
    return HTTP().post("/api/users/logout");
  },
  updateUser(userId, userObject) {
    return HTTP().post("/api/users/updateUser", {
      userId,
      userObject
    });
  },
  createUser(userObj) {
    return HTTP().post("/api/users", userObj);
  },
  deleteUser(userId) {
    return HTTP().delete(`/api/users/${userId}`);
  },
  updatePassword(userId, password) {
    return HTTP().post(`/api/users/updatePassword`, { userId, password });
  },
  resetPassword(password) {
    return HTTP().post(`/api/users/reset-password`, { newPassword: password });
  },
  updateTempPassProperty(userId, tempPass) {
    return HTTP().patch(`/api/users/${userId}`, { temp_pass: tempPass });
  },
  patchUser(userId, userObj) {
    return HTTP().patch(`/api/users/${userId}`, userObj);
  },
  // Roles & Permissions
  getAllRoles() {
    return HTTP().get("/api/Roles");
  },
  getAllACLs() {
    return HTTP().get("/api/ACLs");
  },
  updateRoleACLs(role, checkedACLs) {
    return HTTP().post("/api/ACLs/updateRoleACLs", {
      role: role,
      checkedACLs: checkedACLs
    });
  },
  createACL(payload) {
    return HTTP().post("/api/ACLs", payload);
  },
  updateRoleName(roleId, newName) {
    return HTTP().post("/api/Roles/updateRoleName", {
      roleId,
      newName
    });
  },
  removeFilterData(id) {
    return HTTP().delete(`/api/FilterData/${id}`);
  },
  getAllFilterData() {
    return HTTP().get("/api/FilterData");
  },
  createFilterData(payload) {
    return HTTP().post("/api/FilterData", payload);
  },
  createRole(roleName) {
    return HTTP().post("/api/Roles/", { name: roleName });
  },
  deleteRole(roleId) {
    return HTTP().delete(`/api/Roles/${roleId}`);
  },

  // Activities
  getAllActivities() {
    return HTTP().get("/api/activities?filter[include]=user");
  },
  getActivity(activityId) {
    return HTTP().get(`/api/activities/${activityId}`);
  },
  createActivity(payload) {
    return HTTP().post("/api/activities", payload);
  },
  getLoginCount(unique) {
    if (unique === undefined) {
      unique = true;
    }
    return HTTP().get(`/api/activities/loginCount?unique=${unique}`);
  },

  // Feedback
  getFeedback() {
    return HTTP().get("/api/feedbacks?filter[include]=user");
  },
  submitFeedback(feedbackObj) {
    return HTTP().post("api/feedbacks", feedbackObj);
  },

  // System Alerts
  getSystemAlerts() {
    return HTTP().get("/api/system-alerts");
  },
  updateSystemAlert(alertId, alertObj) {
    return HTTP().patch(`/api/system-alerts/${alertId}`, alertObj);
  },
  createSystemAlert(alertObj) {
    return HTTP().post("/api/system-alerts", alertObj);
  },
  deleteSystemAlert(alertId) {
    return HTTP().delete(`/api/system-alerts/${alertId}`);
  }
};
