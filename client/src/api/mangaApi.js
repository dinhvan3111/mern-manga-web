import { API } from "./apiUrl";
import axiosClient from "./axiosClient";

const mangaApi = {
  getAllMangas: async () => {
    const url = API.MANGA_ALL;
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
};
export default mangaApi;
