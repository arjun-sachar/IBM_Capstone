import axios from "axios";
import api from "@/configs/api.js";

export default () => {
  return axios.create({
    baseURL: api["base_url"],
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("user-token"),
    },
  });
};
