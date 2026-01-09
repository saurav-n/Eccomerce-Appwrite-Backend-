import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders=createAsyncThunk("order/fetchOrders",async()=>{
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/orders`,{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    })
    return response.data.data.orders
})

const initialState={
    orders:[],
    isLoading:false,
    error:null
}

const orderSlice=createSlice({
    name:'order',
    initialState,
    reducers:{
        addOrder:(state,action)=>{
            state.orders.push(action.payload)
        },
        deleteOrder:(state,action)=>{
            state.orders=state.orders.filter(order=>order.$id!==action.payload)
        },
        loadOrders:(state,action)=>{
            state.orders=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchOrders.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(fetchOrders.fulfilled,(state,action)=>{
            state.isLoading=false
            state.orders=action.payload
        })
        builder.addCase(fetchOrders.rejected,(state,action)=>{
            state.isLoading=false
            state.error=action.error.message
        })
    }
})

export const {actions:orderActions,reducer:orderReducer}=orderSlice