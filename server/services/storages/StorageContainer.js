// const FirebaseStorageProvider = require("./providers/FirebaseStorageProvider");
const CloudinaryProvider      = require("../providers/CloudinaryProvider");

const providers = {
    firebase: () => new FirebaseStorageProvider(),
    cloudinary: () => new CloudinaryProvider(),
};

class StorageContainer {
    static resolve(){
        if(!StorageContainer.instance){
            const providerName = process.env.STORAGE_PROVIDER || "firebase";
            if (!providers[providerName]) {
                throw new Error(`Unknown storage provider: ${providerName}`);
            }

            StorageContainer.instance = providers[providerName]();
        }
        return StorageContainer.instance;
    }
    static override(provider) {
        StorageContainer.instance = provider;
    }

    static reset() {
        StorageContainer.instance = null;
    }
}

StorageContainer.instance = null;

module.exports = StorageContainer;