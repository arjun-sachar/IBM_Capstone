import { notification } from "ant-design-vue";

export default {
  errorHandler(errorCode, action) {
    let message;
    if (action) {
      if (errorCode == 400) {
        message =
          "Something went wrong trying to " +
          action +
          ".  Please try again and if the issue persists please try refreshing the browser.";
      } else if (errorCode == 401) {
        message =
          "Something went wrong trying to " +
          action +
          ".  Please try again and if the issue persists please try refreshing the browser.";
      } else if (errorCode == 403) {
        message = "You do not have permission to " + action + ".";
      } else if (errorCode == 404) {
        message =
          "Something went wrong trying to " +
          action +
          ".  Please try again and if the issue persists please try refreshing the browser.";
      } else if (errorCode == 408) {
        action = action.charAt(0).toUpperCase() + action.slice(1);
        message = action + " took too long to process.";
      } else {
        message =
          "Something went wrong trying to " +
          action +
          ".  Please try again and if the issue persists please try refreshing the browser.";
      }
    } else {
      if (errorCode == 403) {
        message = "You do not have permissions to do that.";
      } else {
        message =
          "Something went wrong.  Please try again and if the issue persists please try refreshing the browser.";
      }
    }
    notification.error({
      message: "Error Processing Request",
      description: message
    });
  }
};
