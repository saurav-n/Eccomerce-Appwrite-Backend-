import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders = createAsyncThunk(
  "adminOrder/fetchOrders",
  async (page) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders?page=${page || 1}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.data
    } catch (error) {
      return error;
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "adminOrder/fetchOrder",
  async (orderId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("response", response);
      return response.data.data
    } catch (error) {
      return error;
    }
  }
);

const initialState = {
  data:null,
  isLoading: false,
  error: null,
};

const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState,
    reducers: {
      addOrder: (state, action) => {
        state.orders.push(action.payload);
      },
      deleteOrder: (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.$id !== action.payload
        );
      },
      loadOrders: (state, action) => {
        state.orders = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('from slice',{...state.data,...action.payload})
        if(state.data)state.data={...state.data,...action.payload}
        else state.data=action.payload
      });
      builder.addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
      builder.addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if(state.data)state.data={...state.data,...action.payload}
        else state.data=action.payload
      });
      builder.addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    },
})

export const AdminOrderReducer = adminOrderSlice.reducer
