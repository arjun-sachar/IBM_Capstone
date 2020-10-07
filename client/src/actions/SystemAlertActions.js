import AdminService from "../services/AdminService";

export default {
  get_system_alerts(context) {
    AdminService.getSystemAlerts().then(resp => {
      context.commit("set_system_alerts", resp.data);
    });
  }
};
