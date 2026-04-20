const firebase = require("firebase/app");
const { getStorage, ref, deleteObject, getDownloadURL, uploadBytesResumable, listAll } = require("firebase/storage");
const firebaseConfig = require("../config/firebase.config");
const IStorageProvider = require("./IStorageProvider");

// class FirebaseStorageProvider extends IStorageProvider {
//     constructor() {
//         super();
//         const app = firebase.initializeApp(firebaseConfig);
//         this.storage = getStorage(app);
//     }
// }