const categoryService = require("../services/categoryService");

module.exports = {
  getAllCategories: async (req, res) => {
    const { skip = 0, limit = 10, ...where} = req.query;

    const totalCount = await categoryService.getCountCategories(where);
    const results = await categoryService.getCategories(where, skip, limit);

    return res.json({ totalCount, results });
  },
  
  getCategoryById: async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);

    return res.json(category);
  },

  createCategory: async (req, res, next) => {
    const newcategory = await categoryService.createCategory(req.body);

    return res.json(newcategory);
  },

  updateCategory: async (req, res) => {
    const updateCategory = await categoryService.updateCategory(req.params.id, req.body);
    
    return res.json(updateCategory);
  },

  deleteCategoryById: async (req, res) => {
    const deleteCategory = await categoryService.deleteCategoryById(req.params.id);

    return res.json(deleteCategory);
  }
};