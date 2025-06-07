import { authReducer } from "./authSlice";
import { itemReducer } from "./itemSlice";
import { userReducer } from "./userSlice";
import { orderReducer } from "./orderSlice";
import { combineReducers,configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "./categorySlice";

const rootReducer=combineReducers({
    auth:authReducer,   
    item:itemReducer,
    user:userReducer,
    order:orderReducer,
    category:categoryReducer
})

const store=configureStore({
    reducer:rootReducer
})

export default store