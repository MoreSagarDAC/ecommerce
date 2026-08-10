import CategoryModel from "../../models/category.model.js";

const allCategories = async () => {
  try {
    const categories = await CategoryModel.find();
    return {
      success: true,
      message: "Categories fetched successfully",
      categories: categories,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export default allCategories;
