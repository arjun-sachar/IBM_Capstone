import AdminService from "../services/AdminService";

export default {
  get_alerts(context) {
    // TODO Use DataService call
    const alerts = [
      {
        id: 1,
        title: "Applicant Decrease - 40%",
        type: "danger"
      },
      {
        id: 2,
        title: "2 Day Increase - Stage 7",
        type: "success"
      },
      {
        id: 3,
        title: "1 Day Increase - Stage 2",
        type: "danger"
      },
      {
        id: 4,
        title: "2 Day Increase - Stage 4",
        type: "success"
      }
    ];
    context.commit("set_alerts", alerts);
  },
  set_show_alerts(context, payload) {
    context.commit("set_show_alerts", payload);
  }
};
