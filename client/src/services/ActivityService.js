import AdminService from "./AdminService";
import store from "@/store";

export default activityName => {
  AdminService.createActivity({
    name: activityName,
    userId: store.state.loggedIn ? store.state.currentUser.id : 0,
    date: new Date().toISOString()
  });
};
