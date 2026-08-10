import mongoose from "mongoose";

const addressSchema = mongoose.Schema(
  {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    mobile_number: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const AddressModel = mongoose.model("address", addressSchema);
export default AddressModel;
