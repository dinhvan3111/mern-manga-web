import environmentConfig from "./enviromentConfig";
// import { storageKey, eventsKey } from "./storageKey";

const isDevEnv =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const envConfig = isDevEnv
  ? environmentConfig.development
  : environmentConfig.production;

const Config = {
  isDevEnv,
  apiConfig: {
    ...envConfig,
  },
};

export default Config;
