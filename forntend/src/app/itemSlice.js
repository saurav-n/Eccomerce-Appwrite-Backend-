import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const fetchItems=createAsyncThunk("item/fetchItems",async({page=1,limit=10,categoryName})=>{
    console.log('categoryName',categoryName)
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/item/getItems?page=${page}&limit=${limit}&categoryName=${categoryName}`,{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response)
    return response.data.data
})

const fetchItemsUser=createAsyncThunk("item/fetchItemsUser",async({page=1,limit=10,categoryName,minPrice,maxPrice})=>{
    console.log('categoryName',categoryName)
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/item/getItems?page=${page}&limit=${limit}&categoryName=${categoryName}&minPrice=${minPrice}&maxPrice=${maxPrice}`,{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    })
    console.log(response)
    return response.data.data
})

const initialState={
    items:[],
    paginateData:null,
    isLoading:false,
    isFetchingNextPage:false,
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
            if(!state.items.length)state.isLoading=true
            else state.isFetchingNextPage=true
        })
        builder.addCase(fetchItems.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isFetchingNextPage = false;
          if (
            state.items.length &&
            state.items[0]._id !== action.payload.items[0]._id
          )
            state.items = [...state.items, ...action.payload.items];
          else state.items = action.payload.items;
          state.paginateData = action.payload.paginateData;
        });
        builder.addCase(fetchItems.rejected,(state,action)=>{
            state.isLoading=false
            state.isFetchingNextPage=false
            state.error=action.error.message
        })
        builder.addCase(fetchItemsUser.pending,(state)=>{
            if(!state.items.length)state.isLoading=true
            else state.isFetchingNextPage=true
        })
        builder.addCase(fetchItemsUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isFetchingNextPage = false;
            state.error = action.error.message;
        })
        builder.addCase(fetchItemsUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isFetchingNextPage = false;
            state.items = action.payload.items;
            state.paginateData = action.payload.paginateData;
        })
    }
})

export const {actions:itemActions,reducer:itemReducer}=itemSlice

export {fetchItems,fetchItemsUser}