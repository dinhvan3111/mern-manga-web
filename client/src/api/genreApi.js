import { API } from "./apiUrl";
import axiosClient from "./axiosClient";

const genreApi = {
  getAllGenres: async () => {
    const url = API.GENRE_ALL;
    try {
      const res = await axiosClient.get(url);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
};

export default genreApi;
