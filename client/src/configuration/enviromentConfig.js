const enviromentConfig = {
  development: {
    endPoint: process.env.REACT_APP_BACKEND_DOMAIN_DEV,
  },
  production: {
    endPoint: process.env.REACT_APP_BACKEND_DOMAIN,
  },
};
export default enviromentConfig;
