import axios from "axios";
import { API } from "./apiUrl";
import axiosClient from "./axiosClient";
import Config from "../configuration/config";
import store from "../redux-toolkit/configureStore";

const mangaApi = {
  addManga: async (data) => {
    const url = API.ADD_MANGA;
    try {
      const res = await axiosClient.post(url, data);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  updateManga: async (id, data) => {
    const url = API.UPDATE_MANGA(id);
    try {
      const res = await axiosClient.put(url, data);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  deleteManga: async (id) => {
    const url = API.DELETE_MANGA(id);
    try {
      const res = await axiosClient.delete(url);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  getAllMangas: async (
    page = 1,
    limit = 5,
    { sortByViews, sortByLatestUpdate }
  ) => {
    const url = API.MANGA_ALL(page, limit, sortByViews, sortByLatestUpdate);
    try {
      const res = await axiosClient.get(url);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  getMangaById: async (id) => {
    const url = API.MANGA_BY_ID(id);
    try {
      const res = await axiosClient.get(url);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  searchMangaByKey: async (key, page = 1, limit = 5) => {
    const url = API.SEARCH_MANGA(key, page, limit);
    try {
      const res = await axiosClient.get(url);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  uploadMangaThumb: async (id, data) => {
    const url = API.UPLOAD_FILE(id);
    try {
      const res = await axios.post(url, data, {
        baseURL: Config.apiConfig.endPoint,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${
            store.getState()?.auth?.user?.token?.accessToken
          }`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },
};
export default mangaApi;
