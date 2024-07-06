import { createSlice } from "@reduxjs/toolkit";

const initialState={
    users :[]
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.users.push(action.payload)
        },
        updateUser:(state,action)=>{
            state.users=state.users.map(user=>user.accountId===action.payload.id?action.payload.updatedUser:user)
        },
        loadUsers:(state,action)=>{
            state.users=action.payload
        }
    }
})

export const {actions:userActions,reducer:userReducer}=userSlice