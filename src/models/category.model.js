import mongoose, { Types } from "mongoose";

const categoryScheema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      require: true,
    },
    image: [
      {
        type: String,
      },
    ],
    parentCatName: {
      type: String,
      default: "",
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("category", categoryScheema);
export default CategoryModel;
