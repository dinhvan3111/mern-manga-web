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
  MANGA_ALL: (page, limit) => `/api/manga?page=${page}&limit=${limit}`,
  MANGA_BY_ID: (id) => `/api/manga/${id}`,
  SEARCH_MANGA: (key, page, limit) =>
    `/api/manga/search?key=${key}&page=${page}&limit=${limit}`,
  UPLOAD_FILE: (id) => `/api/manga/uploadThumb/${id}`,

  // ===========GENRE===============
  GENRE_ALL: "/api/genre",
};
