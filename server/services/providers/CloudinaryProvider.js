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
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(filePath, (error, result) => {
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
}

module.exports = CloudinaryProvider;