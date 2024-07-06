import envVars from "../../importEnvVars/importEnvVars";
import { Client,Databases, ID } from "appwrite";

class ItemDbService{
    constructor(){
        this.client=new Client().
            setEndpoint(envVars.appUrl).
            setProject(envVars.projectId)
        
        this.database=new Databases(this.client)
    }

    async createItem({name,desc,ownerId,price,featuredImgs,genre,belongsTo,maxQty}){
        try {
            const newItem=await this.database.createDocument(envVars.dbId,envVars.collectionItemsId,ID.unique(),{
                name,
                desc,
                ownerId,
                price,
                featuredImgs,
                genre,
                belongsTo,
                maxQty,
                isFeatured:false,
                rating:'0.0',
                noOfRatings:0,
                ratedBy:[],
                raters:[],
                allRatings:[],
            })
            if(newItem){
                return newItem
            }
            return null
        } catch (error) {
            throw error
        }
    }

    async deleteItem(itemId){
        try {
            await this.database.deleteDocument(envVars.dbId,envVars.collectionItemsId,itemId)
        } catch (error) {
            throw error
        }
    }

    async updateItem({itemId,name,desc,ownerId,price,featuredImgs,genre,belongsTo,maxQty,isFeatured,rating,noOfRatings,raters,
        allRatings,ratedBy}){
        try {
            const updatedItem=await this.database.updateDocument(envVars.dbId,envVars.collectionItemsId,itemId,{
                name,
                desc,
                ownerId,
                price,
                featuredImgs,
                genre,
                belongsTo,
                maxQty,
                isFeatured,
                rating,
                noOfRatings,
                raters,
                allRatings,
                ratedBy
            })
            if(updatedItem){
                return updatedItem
            }
            return null 
        } catch (error) {
            throw error
        }
    }

    async updateAllItems(items){
        try {
            let updatedItems=[]
            for (const item of items) {
                const updatedItem=await this.updateItem({
                    itemId:item.$id,
                    ...item
                })
                updatedItems=[...updatedItems,updatedItem]
            }
            return updatedItems
        } catch (error) {
            throw error
        }
    }

    async getAllItems(){
        try {
            return await this.database.listDocuments(envVars.dbId,envVars.collectionItemsId)
        } catch (error) {
            throw error
        }
    }
}

export const itemDbService=new ItemDbService()