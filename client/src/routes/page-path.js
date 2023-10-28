let DOMAIN = process.env.REACT_APP_FRONTEND_DOMAIN_DEV;
if (!window.location.hostname.includes("localhost")) {
  DOMAIN = process.env.REACT_APP_FRONTEND_DOMAIN;
} else if (window.location.hostname.includes("onrender")) {
  DOMAIN = process.env.REACT_APP_ONRENDER_DOMAIN;
}
const PAGE_PATH = {
  BASE: DOMAIN,
  HOME: "/",
  NOT_FOUND: "/not-found",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",

  //==========MANGA==================
  ADD_MANGA: "/admin/manga/add",
  EDIT_MANGA: (id) =>
    id === undefined ? "/admin/manga/edit/:id" : `/admin/manga/edit/${id}`,
  CHAPTERS_MANAGEMENT: (id) =>
    id === undefined
      ? "/admin/manga/:id/chapter"
      : `/admin/manga/${id}/chapter`,
  MANGA_MANAGEMENT: "/admin/manga/management",
  MANGA_DETAIL: (id) => (id === undefined ? "/manga/:id" : `/manga/${id}`),
  SEARCH_MANGA: (key) =>
    key === undefined ? "/manga/search" : `/manga/search?key=${key}`,
  LIBRARY: "/library",

  //==========CHAPTER===============
  READ_CHAPTER: (id, page = 1) =>
    id === undefined ? `/chapter/:id/:page` : `/chapter/${id}/${page}`,
};

export { PAGE_PATH };
