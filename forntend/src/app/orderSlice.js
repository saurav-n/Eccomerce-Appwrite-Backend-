import { createSlice } from "@reduxjs/toolkit";

const initialState={
    orders:[]
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
    }
})

export const {actions:orderActions,reducer:orderReducer}=orderSlice