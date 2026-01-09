import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    enum: ["Nepal"],
    default: "Nepal",
  },
  state: {
    type: String,
    enum: [
      "Koshi",
      "Bagmati",
      "Sudurpaschim",
      "Lumbini",
      "Gandaki",
      "Madhesh",
      "Karnali",
    ],
    required: true,
  },
  city: {
    type: String,
    required: true,
  },

  street: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
});

export default mongoose.model("Address", addressSchema);
