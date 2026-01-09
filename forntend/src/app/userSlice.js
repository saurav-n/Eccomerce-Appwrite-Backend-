import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

const fetchUsers=createAsyncThunk("user/fetchUsers",async()=>{
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getUsers`,{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response.data.data.users)
    return response.data.data.users
})

const initialState={
    users :[],
    isLoading:false,
    error:null
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUsers.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(fetchUsers.fulfilled,(state,action)=>{
            state.isLoading=false
            state.users=action.payload
        })
        builder.addCase(fetchUsers.rejected,(state,action)=>{
            state.isLoading=false
            state.error=action.error.message
        })
    }
})

export const {actions:userActions,reducer:userReducer}=userSlice

export {fetchUsers}