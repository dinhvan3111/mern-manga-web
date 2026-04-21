const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");
const IStorageProvider = require("../storages/IStorageProvider");

class CloudinaryProvider extends IStorageProvider {
    constructor() {
        super();
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    getPublicId(url) {
        const part = url.split('/upload/')[1];
        const withoutVersion = part.replace(/^v\d+\//, '');
        return withoutVersion.replace(/\.[^/.]+$/, '');
    }

    async upload(file, destination) {
        return new Promise((resolve, reject) => {
            // Implementation for uploading file to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: destination,
                    public_id: file.originalname,
                    resource_type: "auto",
                },
                (error, result) => {   
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );
            const readable = new Readable();
            readable.push(file.buffer);
            readable.push(null);
            readable.pipe(uploadStream);
        });
    }

    async delete(filePath) {
        var publicId = this.getPublicId(filePath);
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async getFile(filePath) {
        return cloudinary.url(filePath, { secure: true });
    }
    async getAllFiles(folderPath) {
        const result = await cloudinary.api.resources({
            type: "upload",
            prefix: folderPath,
            max_results: 100,
        });
        return result.resources.map((file) => file.secure_url);
    }

    async deleteAll(folderPath) {
        const result = await cloudinary.api.resources({
            type: "upload",
            prefix: folderPath,
            max_results: 100,
        });
        const deletePromises = result.resources.map((file) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(file.public_id, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        });
        return Promise.all(deletePromises);
    }

    async deleteFolder(folderPath) {
        // Step 1 — get all files
        const result = await cloudinary.api.resources({
          type:        "upload",
          prefix:      folderPath,
          max_results: 100,
        });
      
        // Step 2 — delete all files if any exist
        if (result.resources.length) {
          const publicIds = result.resources.map((file) => file.public_id);
          await cloudinary.api.delete_resources(publicIds);
        }
      
        // Step 3 — delete the folder itself
        const deleteFolderResult = await cloudinary.api.delete_folder(folderPath);
        return deleteFolderResult.deleted.includes(folderPath);
      }
}

module.exports = CloudinaryProvider;