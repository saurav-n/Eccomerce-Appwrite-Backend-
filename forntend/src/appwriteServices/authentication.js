import envVars from "../importEnvVars/importEnvVars";
import {Account,Client,ID} from "appwrite"
import { userDbService } from "./database/userDb";



class AuthService{
    constructor(){
        this.client=new Client().
            setEndpoint(envVars.appUrl).
            setProject(envVars.projectId)
        
        this.account=new Account(this.client)
    }

    async createUserAccount({email,password}){
        try {
            const newUserAccount=await this.account.create(ID.unique(),email,password)
            return newUserAccount?newUserAccount:null
        } catch (error) {
            throw error
        }
    }

    async logIn({email,password}){
        try {
            const session=await this.account.createEmailSession(email,password)
            if(session){
                localStorage.setItem('sessionId',session.$id)
                const currentUser=await this.getCurrentUser()
                if(currentUser){
                    return currentUser
                }
                return null
            }
            return null
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            const currentUser=await this.account.get()
            return currentUser?currentUser:null
        } catch (error) {
           throw error 
        }
    }

    async logOut(){
        try {
            await this.account.deleteSession(localStorage.getItem('sessionId'))
        } catch (error) {
            throw error
        }
    }
}

export const authService=new AuthService()