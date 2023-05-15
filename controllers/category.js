import { isValidObjectId } from "mongoose";
import Category from "../models/category.js";
import Http from "http-status-codes";
export function addCategory(req, res) {
  const newCategory = new Category({
    // Create a new category object
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  Category.create(newCategory) // Save the category object to the database
    .then((result) => {
      if (!result) {
        // If the category object is not saved to the database
        return res.status(Http.BAD_REQUEST).json({
          success: false,
          message: "Category not created", // Return an error message
        });
      }
      return res.status(Http.CREATED).json({
        // If the category object is saved to the database
        success: true,
        message: "Category created", // Return a success message
        category: result,
      });
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        // If there is a server error
        success: false,
        message: "Server error",
        error: err,
      });
    });
}
export function deleteCategory(req, res) {
  // Delete a category
  const id = req.params.id; // Get the category id from the request parameters
  Category.findByIdAndDelete(id) // Find the category by id and delete it
    .then((result) => {
      if (!result) {
        // If the category is not found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Category not found", // Return an error message
        });
      }
      return res.status(Http.OK).json({
        // If the category is found and deleted
        success: true,
        message: "Category deleted", // Return a success message
        data: result,
      });
    })
    .catch((err) => {
      // If there is a server error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err,
      });
    });
}
export function getCategories(req, res) {
  Category.find() // Find all categories
    .select("-__v") // Exclude the __v
    .sort({ createdAt: -1 }) // Sort the categories in descending order
    .then((result) => {
      if (result.length == 0) {
        // If no categories are found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Categories not found", // Return an error message
        });
      }
      return res.status(Http.OK).json({
        // If categories are found
        success: true,
        categories: result, // Return the categories
      });
    })
    .catch((err) => {
      // If there is a server error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "error",
        error: err,
      });
    });
}
export function deleteCategories(req, res) {
  // Delete all categories
  Category.deleteMany() // Delete all categories
    .then((result) => {
      if (!result) {
        // If no categories are found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Categories not found", // Return an error message
        });
      }
      return res.status(Http.OK).json({
        // If categories are found and deleted
        success: true,
        message: "Categories deleted", // Return a success message
      });
    })
    .catch((err) => {
      // If there is a server error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err,
      });
    });
}
export function getCategory(req, res) {
  const id = req.params.id; // Get the category id from the request parameters
  Category.findById(id) // Find the category by id
    .select("-__v") // Exclude the __v
    .then((result) => {
      if (!result) {
        // If the category is not found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Category not found", // Return an error message
        });
      }
      return res.status(Http.OK).json({
        // If the category is found
        success: true,
        category: result, // Return the category
      });
    })
    .catch((err) => {
      // If there is a server error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err,
      });
    });
}
export function updateCategory(req, res) {
  const newCategory = {
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  };
  const id = req.params.id; // Get the category id from the request parameters
  if (!isValidObjectId(id)) {
    // If the category id is not a valid object id
    return res.status(Http.BAD_REQUEST).json({
      success: false,
      message: "Invalid category id", // Return an error message
    });
  }
  Category.findByIdAndUpdate(id, newCategory, { new: true }) // Find the category by id and update it
    .then((result) => {
      if (!result) {
        // If the category is not found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Category not found", // Return an error message
        });
      }
      return res.status(Http.OK).json({
        // If the category is found and updated
        success: true,
        message: "Category updated", // Return a success message
        data: result,
      });
    })
    .catch((err) => {
      // If there is a server error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err,
      });
    });
}
