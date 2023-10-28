export const ROLE = {
  ADMIN: 0,
  AUTHOR: 1,
  USER: 2,
};

export const SUBMIT_STATUS = {
  SUCCESS: "success",
  LOADING: "loading",
  FAILED: "failed",
  ERROR: "error",
};

export const USER_MENU = {
  PREFERENCES: {
    SETTING: 1,
    THEME: 2,
  },
  AUTH_OPTIONS: {
    SIGN_IN: 1,
    REGISTER: 2,
    SIGN_OUT: 3,
  },
};

export const DRAWER_TYPE = {
  RESPONSIVE: 1,
  TEMPORARY: 2,
};

export const ACCORDION_NAV_OPTION = {
  HOME: 0,
  FOLLOWING: {
    UPDATE: 1,
    LIBRARY: 2,
  },
  TITLES: {
    AVANCED_SEARCH: 3,
    RECENT_ADDED: 4,
    LATEST_UPDATE: 5,
    RANDOM: 6,
  },
  COMMUNITY: {
    FORUMS: 7,
    GROUPS: 8,
    USER: 9,
  },
  VZ_MANGA: {
    ABOUT_US: 10,
    PRIVACY_POLICY: 11,
  },
  ADMIN: {
    MANGA_MANGAEMENT: 12,
  },
};

export const MANGA_STATUS = {
  ON_GOING: 0,
  COMPLETED: 1,
  ABANDONED: 2,
};
export const PROFILE_ACTION = {
  FOLLOW: 1,
  MESSAGE: 2,
  REPORT: 3,
};

export const reactQueryKey = {
  POPULAR_MANGA: ["popularManga"],
  ALL_MANGA: ["mangaAll"],
};

export const DETAIL_MANGA_TAG = {
  AUTHORS: 1,
  ARTISTS: 2,
  GENRES: 3,
};

export const SORT_CHAPTER = {
  ASC: 1,
  DESC: -1,
};

export const MANGA_ENTITY_UI = {
  LIST: 1,
  THUMBNAIL_COVER: 2,
};
