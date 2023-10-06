import { API } from "./apiUrl";
import axiosClient from "./axiosClient";

const authApi = {
  register: (data) => {
    const url = API.REGISTER;
    return axiosClient.post(url, data);
  },
  login: ({ username, password }) => {
    const data = { username, password };
    const url = API.LOGIN;
    return axiosClient.post(url, data);
  },
  // refreshToken: () => {
  //   const url = API.REFRESH_TOKEN;
  //   return axiosClient.post(url);
  // },
};

export default authApi;
