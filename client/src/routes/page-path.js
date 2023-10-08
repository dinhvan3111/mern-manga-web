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

  MANGA_DETAIL: (id) => (id === undefined ? "/manga/:id" : `/manga/${id}`),
  LIBRARY: "/library",
};

export { PAGE_PATH };
