export const API = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REGISTER: "/api/auth/register",
  VERIFY_ACCOUNT_BY_TOKEN: "/api/user/verify-status/verify",
  REFRESH_TOKEN: "/api/auth/refresh",

  // =========MANGA===============
  ADD_MANGA: "/api/manga",
  UPDATE_MANGA: (id) => `/api/manga/${id}`,
  DELETE_MANGA: (id) => `/api/manga/${id}`,
  MANGA_ALL: (page, limit, sortByViews, sortByLatestUpdate) =>
    `/api/manga?page=${page}&limit=${limit}${
      sortByViews ? `&sortByViews=${sortByViews}` : ""
    }${sortByLatestUpdate ? `&sortByLatestUpdate=${sortByLatestUpdate}` : ""}`,
  MANGA_BY_ID: (id) => `/api/manga/${id}`,
  SEARCH_MANGA: (key, page, limit) =>
    `/api/manga/search?key=${key}&page=${page}&limit=${limit}`,
  UPLOAD_FILE: (id) => `/api/manga/uploadThumb/${id}`,

  // ===========GENRE===============
  GENRE_ALL: "/api/genre",

  // ===========CHAPTER===============
  ADD_CHAPTER: "/api/chapter",
  GET_ALL_CHAPTER: (mangaId, page, limit, sortByTime) =>
    `/api/chapter/${mangaId}?page=${page}&limit=${limit}${
      sortByTime ? `&sortByTime=${sortByTime}` : ""
    }`,
  GET_ALL_IMAGES_OF_CHAPTER: (id) => `/api/chapter/${id}/imgs`,
  UPDATE_CHAPTER: (id) => `/api/chapter/${id}`,
  DELETE_CHAPTER: (id) => `/api/chapter/${id}`,
};
