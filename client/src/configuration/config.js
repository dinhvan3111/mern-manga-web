import environmentConfig from "./enviromentConfig";
// import { storageKey, eventsKey } from "./storageKey";

const isDevEnv =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";
console.log("!process.env.NODE_ENV", !process.env.NODE_ENV);
console.log(
  ` process.env.NODE_ENV === "development"`,
  process.env.NODE_ENV === "development"
);
console.log("isDevEnv", isDevEnv);
const envConfig = isDevEnv
  ? environmentConfig.development
  : environmentConfig.production;
console.log("envConfig", envConfig);
const Config = {
  isDevEnv,
  apiConfig: {
    ...envConfig,
  },
};

export default Config;
