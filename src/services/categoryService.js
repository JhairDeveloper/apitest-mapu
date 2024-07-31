const Category = require("../models/Category");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = require("mongoose");

const getCategories = async (where = {}, skip, limit) => {
  const categories = await Category.find(where).skip(skip).limit(limit);

  return categories;
};

const getCountCategories = async (where = {}) => {
  const numberCategories = await Category.count(where);

  return numberCategories;
};

const getCategoryById = async (id) => {
  if(!isValidObjectId(id)){
    throw new ValidationError("El dato enviado debe ser un ObjectId");
  }
  const category = await Category.findById(id);
    
  if(!category){
    throw new ValidationError("Categoría no encontrada");
  }
  return category;
};

const createCategory = async (categoryData) => {
  const category = await Category.create(categoryData);

  return category;
};

const updateCategory = async (id, categoryData) => {
  if(!isValidObjectId(id)){
    throw new ValidationError("El dato enviado debe ser un ObjectId");
  }

  const updateCategory = await Category.findByIdAndUpdate(id, categoryData, { new: true});

  if(!updateCategory){
    throw new ValidationError("Categoría no encontrada");
  }    

  return updateCategory;
};

const deleteCategoryById = async (id) => {
  if(!isValidObjectId(id)){
    throw new ValidationError("El dato enviado debe ser un ObjectId");
  }

  const deleteCategory = await Category.findByIdAndDelete(id);

  if(!deleteCategory){
    throw new ValidationError("Categoria no encontrada");
  }

  return deleteCategory;
};

module.exports = {
  getCategories,
  getCountCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategoryById,
};