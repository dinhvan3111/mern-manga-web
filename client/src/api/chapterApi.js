import axios from "axios";
import { API } from "./apiUrl";
import axiosClient from "./axiosClient";
import Config from "../configuration/config";
import store from "../redux-toolkit/configureStore";

const chapterApi = {
  addChapter: async (data) => {
    const url = API.ADD_CHAPTER;
    try {
      const res = await axiosClient.post(url, data);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  updateChapter: async (id, data) => {
    const url = API.UPDATE_CHAPTER(id);
    try {
      const res = await axiosClient.put(url, data);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  deleteChapter: async (id) => {
    const url = API.DELETE_CHAPTER(id);
    try {
      const res = await axiosClient.delete(url);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  getAllChapters: async (mangaId, page = 1, limit = 5, sortByTime) => {
    const url = API.GET_ALL_CHAPTER(mangaId, page, limit, sortByTime);
    try {
      const res = await axiosClient.get(url);
      return res;
    } catch (error) {
      console.log(error);
    }
  },

  getAllImgsOfChapter: async (id) => {
    const url = API.GET_ALL_IMAGES_OF_CHAPTER(id);
    try {
      const res = await axiosClient.get(url);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  updateListImgsOfChapter: async (id, data) => {
    const url = API.UPDATE_LIST_IMAGES_OF_CHAPTER(id);
    try {
      // const res = await axios.post(url, data, {
      //   baseURL: Config.apiConfig.endPoint,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     Authorization: `Bearer ${
      //       store.getState()?.auth?.user?.token?.accessToken
      //     }`,
      //   },
      // });
      const res = await axiosClient.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
};

export default chapterApi;
