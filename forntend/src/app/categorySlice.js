import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchCategories=createAsyncThunk("category/fetchCategories",async()=>{
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getCategories`,{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log('category response',response)
    return response.data.data.categories
})

const categorySlice=createSlice({
    name:"category",
    initialState:{
        categories:[],
        isLoading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchCategories.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(fetchCategories.fulfilled,(state,action)=>{
            state.categories=action.payload
            state.isLoading=false
        })
        builder.addCase(fetchCategories.rejected,(state,action)=>{
            state.isLoading=false
            state.error=action.error.message
        })
    }
})

const categoryReducer=categorySlice.reducer

export {fetchCategories,categoryReducer}

