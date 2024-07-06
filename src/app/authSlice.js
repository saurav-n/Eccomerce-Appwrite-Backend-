import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userData:null,
    status:false
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        logIn:(state,action)=>{
            state.userData=action.payload
            state.status=true
        },
        logOut:(state,action)=>{
            state.userData=null
            state.status=false
        }
    }
})

export const {actions:authActions,reducer:authReducer}=authSlice