import axios from "axios";
import queryString from "query-string";
import store from "../redux-toolkit/configureStore";
import Config from "../configuration/config";
import { invalidateToken, updateToken } from "../redux-toolkit/authSlice";
import authApi from "./authApi";

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
  async (error) => {
    // Handle errors
    const originalRequest = error.config;
    // Handle if the accesstoken is expired then refresh the tokens
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const oldRefreshToken = store.getState()?.auth?.user?.token.refreshToken;
      const res = await authApi.refreshToken(oldRefreshToken);
      if (!res.success) return error.response.data;
      store.dispatch(updateToken(res.data));
      originalRequest.headers = {
        ...originalRequest.headers,
        authorization: `Bearer ${res?.data.accessToken}`,
      };
      // axios.defaults.headers.Authorization = "Bearer " + res.accessToken;
      return axiosClient(originalRequest);
    }
    if (error.response.status === 406 && !originalRequest._retry) {
      store.dispatch(invalidateToken());
    }
    // return Promise.reject(error);
    return error.response.data;
  }
);

export default axiosClient;
