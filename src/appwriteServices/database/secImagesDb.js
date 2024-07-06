import { Client,Databases,Query } from "appwrite"
import envVars from "@/importEnvVars/importEnvVars"
class SecImagesDBServie{
    constructor(){
        this.client=new Client().
            setEndpoint(envVars.appUrl).
            setProject(envVars.projectId)
        this.database=new Databases(this.client)
    }

    async getImages(documentId){
        try {
            return await this.database.listDocuments(envVars.dbId,envVars.collectionSecImagesId,[Query.equal('documentId',documentId)])
        } catch (error) {
            throw error;
        }
    }
}

export const secImagesDBService=new SecImagesDBServie()