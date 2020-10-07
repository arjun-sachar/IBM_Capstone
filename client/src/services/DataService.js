import HTTP from "./HTTP";
import CustomHTTP from "./CustomHTTP";

export default {
  // Widgets
  getAllWidgets() {
    return HTTP().get("/api/widgets");
  },

  // Upload
  uploadData(formData) {
    return HTTP().post("/api/upload", formData);
  },
  getUploads() {
    return HTTP().get("/api/uploads");
  },

  getApiData() {
      let dataGathered = HTTP().get("/api/data");
      dataGathered.catch(error => window.alert("Your data isn't loading"));
      return dataGathered;
  }
};
