class IStorageProvider {
    async upload(file, destination) { throw new Error('Method not implemented'); }
    async delete(filePath) { throw new Error('Method not implemented'); }
    async deleteAll(folderPath) { throw new Error('Method not implemented'); }
    async deleteFolder(folderPath) { throw new Error('Method not implemented'); }
    async getFile(filePath) { throw new Error('Method not implemented'); }
    async getFile(filePath) { throw new Error('Method not implemented'); }
    async getAllFiles(folderPath) { throw new Error('Method not implemented'); }
}

module.exports = IStorageProvider;