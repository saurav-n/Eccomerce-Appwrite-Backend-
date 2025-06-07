import envVars from "../importEnvVars/importEnvVars";
import { Client,ID,Storage } from "appwrite";

class StorageService{
    constructor(){
        this.client=new Client().
            setEndpoint(envVars.appUrl).
            setProject(envVars.projectId)

        this.storage=new Storage(this.client)
    }

    async uploadFile(file){
        try {
            const newFile=await this.storage.createFile(envVars.buckedId,ID.unique(),file)
            return newFile?newFile:null
        } catch (error) {
            throw error
        }
    }

    async delteFile(fileId){
        try {
           return await this.storage.deleteFile(envVars.buckedId,fileId)
        } catch (error) {
            throw error
        }
    }

    getFilePreview(fileId){
        try {
            return this.storage.getFilePreview(envVars.buckedId,fileId)
        } catch (error) {
            console.log('caught an error')
            console.log(error)
        }
    }
}

export const storageService=new StorageService()