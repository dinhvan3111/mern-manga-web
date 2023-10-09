import axios from "axios";
import queryString from "query-string";
import store from "../redux-toolkit/configureStore";
import Config from "../configuration/config";

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
  baseURL: Config.apiConfig.endPoint,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  if (store.getState()?.auth?.user?.token && !config.headers.Authorization) {
    const accessToken = store.getState()?.auth?.user?.token?.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    // Handle errors
    if (error && error.response) {
      return error.response.data;
    }

    throw error;
  }
);

export default axiosClient;
