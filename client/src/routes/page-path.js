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

  ADD_MANGA: "/admin/manga/add",
  MANGA_MANAGEMENT: "/admin/manga/management",
  MANGA_DETAIL: (id) => (id === undefined ? "/manga/:id" : `/manga/${id}`),
  SEARCH_MANGA: (key) =>
    key === undefined ? "/manga/search" : `/manga/search?key=${key}`,
  LIBRARY: "/library",
};

export { PAGE_PATH };
