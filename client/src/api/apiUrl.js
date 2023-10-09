export const API = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REGISTER: "/api/auth/register",
  VERIFY_ACCOUNT_BY_TOKEN: "/api/user/verify-status/verify",
  REFRESH_TOKEN: "/api/auth/refresh",

  MANGA_ALL: "/api/manga",
  MANGA_BY_ID: (id) => `/api/manga/${id}`,
  SEARCH_MANGA: (key, page, limit) =>
    `/api/manga/search?key=${key}&page=${page}&limit=${limit}`,
};
