import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDashBoardData = createAsyncThunk(
  "dashBoardData/fetchDashBoardData",
  async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/dashBoradData`,{
            headers:{
                'Authorization':`Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log('dash board',response.data.data)
        return response.data.data;
    } catch (error) {
        console.log('dash board',error);
        return error;
    }
  }
);

export const dashBoardDataSlice = createSlice({
  name: "dashBoardData",
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashBoardData.fulfilled, (state, action) => {
      state.isLoading=false
      state.error=null
      state.data=action.payload
    });
    builder.addCase(fetchDashBoardData.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDashBoardData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});


export const DashBoradDataReducer = dashBoardDataSlice.reducer;