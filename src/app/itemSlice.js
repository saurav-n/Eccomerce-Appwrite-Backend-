import { createSlice } from "@reduxjs/toolkit";

const initialState={
    items:[]
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
    }
})

export const {actions:itemActions,reducer:itemReducer}=itemSlice