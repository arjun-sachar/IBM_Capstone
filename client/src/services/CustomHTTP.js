import axios from "axios";

export default (base, credentials, headers) => {
  return axios.create({
    baseURL: base,
    withCredentials: credentials != null ? credentials : false,
    headers: headers != null ? headers : {}
  });
};
