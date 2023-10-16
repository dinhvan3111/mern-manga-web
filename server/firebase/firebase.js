const firebase = require("firebase/app");
// const getAnalytics = require("firebase/analytics");
const {
  getStorage,
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
  listAll,
  list,
} = require("firebase/storage");
const firebaseConfig = require("../config/firebase.config");
