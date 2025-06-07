import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const fetchItems=createAsyncThunk("item/fetchItems",async()=>{
    const response=await axios.get("http://localhost:3000/api/item/getItems",{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    })
    return response.data.data.items
})

const initialState={
    items:[],
    isLoading:false,
    error:null
}

const itemSlice=createSlice({
    name:'item',
    initialState,
    reducers:{
        addItem:(state,action)=>{
            state.items.push(action.payload)
        },

        deleteItem:(state,action)=>{
            state.items=state.items.filter(item=>item.$id!==action.payload)
        },
        updateItem:(state,action)=>{
            state.items=state.items.map(item=>item.$id===action.payload.id?action.payload.updatedItem:item)
        },
        updateAllItems:(state,action)=>{
            state.items=action.payload
        },
        loadItems:(state,action)=>{
            state.items=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchItems.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(fetchItems.fulfilled,(state,action)=>{
            state.isLoading=false
            state.items=action.payload
        })
        builder.addCase(fetchItems.rejected,(state,action)=>{
            state.isLoading=false
            state.error=action.error.message
        })
    }
})

export const {actions:itemActions,reducer:itemReducer}=itemSlice

export {fetchItems}