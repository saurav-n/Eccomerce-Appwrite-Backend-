import envVars from "../../importEnvVars/importEnvVars";
import { Client,Databases, ID } from "appwrite";
import { orderActions } from "../../app/orderSlice";


class OrderDbService{
    constructor(){
        this.client=new Client().
            setEndpoint(envVars.appUrl).
            setProject(envVars.projectId)

        this.database=new Databases(this.client)
    }

    async createOrder({itemId,quantity,customerId}){
        try {
            const newOrder=await this.database.createDocument(envVars.dbId,envVars.collectionOrderId,ID.unique(),{
                itemId,
                quantity,
                customerId
            })
            if(newOrder){
                return newOrder
            }
            return null
        } catch (error) {
            throw error
        }
    }

    async deleteOrder(orderId){
        try {
            await this.database.deleteDocument(envVars.dbId,envVars.collectionOrderId,orderId)
        } catch (error) {
            throw error
        }
    }
    async getAllOrders(){
        try {
            return await this.database.listDocuments(envVars.dbId,envVars.collectionOrderId)
        } catch (error) {
            throw error
        }
    }
}

export const orderDbService=new OrderDbService()