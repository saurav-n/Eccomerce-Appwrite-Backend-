import { authReducer } from "./authSlice";
import { itemReducer } from "./itemSlice";
import { userReducer } from "./userSlice";
import { orderReducer } from "./orderSlice";
import { combineReducers,configureStore } from "@reduxjs/toolkit";

const rootReducer=combineReducers({
    auth:authReducer,
    item:itemReducer,
    user:userReducer,
    order:orderReducer,
})

const store=configureStore({
    reducer:rootReducer
})

export default store