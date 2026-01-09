import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
  addresses: [],
  isLoading: false,
  error: null,
}

export const fetchAddresses = createAsyncThunk("address/fetchAddresses", async () => {
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/addresses`,{
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })

    console.log('address response',response)

    return response.data.data.addresses
})

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAddresses.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(fetchAddresses.fulfilled, (state, action) => {
      state.addresses = action.payload
      state.isLoading = false
    })

    builder.addCase(fetchAddresses.rejected, (state, action) => {
      state.error = action.error.message
      state.isLoading = false
    })
  },
})

export const AddressReducer=addressSlice.reducer