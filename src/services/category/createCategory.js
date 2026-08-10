import CategoryModel from "../../models/category.model.js";

const createCategory = async (categoryData) => {
  try {
    if (!categoryData.name) {
      return {
        success: false,
        message: "Category name is required",
        error: true,
      };
    }
    const existingCategory = await CategoryModel.findOne({
      name: categoryData.name,
    });
    if (existingCategory) {
      return {
        success: false,
        message: "Category already exists",
        error: true,
      };
    }
    const category = await CategoryModel.create(categoryData);
    return {
      success: true,
      message: "Category created successfully",
      category: category,
    };
  } catch (error) {
    return {
      success: false,
      message: "Category creation failed",
      error: error.message,
    };
  }
};

export default createCategory;
