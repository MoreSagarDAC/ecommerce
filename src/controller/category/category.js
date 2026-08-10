import createCategory from "../../services/category/createCategory.js";
import allCategories from "../../services/category/allCategories.js";
const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const fetchAllCategories = async (req, res) => {
  try {
    const categories = await allCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export { createCategoryController, fetchAllCategories };
