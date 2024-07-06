import envVars from "../../importEnvVars/importEnvVars";
import { Client, Databases, ID } from "appwrite";

class UserDbService {
    constructor() {
        this.client = new Client().
            setEndpoint(envVars.appUrl).
            setProject(envVars.projectId)

        this.database = new Databases(this.client)
    }

    async createUser({ accountId, isSeller,searchHistory,carts,cartItemQty }) {
        try {
            const newUser = await this.database.createDocument(envVars.dbId, envVars.collectionUserId, ID.unique(), {
                accountId,
                isSeller,
                searchHistory,
                carts,
                cartItemQty
            })
            if(newUser){
                return newUser
            }
        } catch (error) {
            throw error
        }
    }

    async updateUser({userId,accountId,isSeller,searchHistory,carts,cartItemQty}){
        try {
            const updatedUser=await this.database.updateDocument(envVars.dbId,envVars.collectionUserId,userId,{
                accountId,
                isSeller,
                searchHistory,
                carts,
                cartItemQty
            })

            if(updatedUser){
                return updatedUser
            }
            return null   
        } catch (error) {
            throw error
        }
    }
    async getAllUser(){
        try {
            return await this.database.listDocuments(envVars.dbId,envVars.collectionUserId)
        } catch (error) {
            throw error
        }
    }
}

export const userDbService=new UserDbService()