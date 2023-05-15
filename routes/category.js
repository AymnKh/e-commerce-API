import express from "express";
import {
  addCategory,
  deleteCategories,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.js";

const router = express.Router(); // Create a router object

router.post("/add", addCategory); // add Category
router.route("/").get(getCategories).delete(deleteCategories); // get or delete Categories
router
  .route("/:id")
  .get(getCategory)
  .delete(deleteCategory)
  .put(updateCategory); //get ,delete or update Category

export default router; // Export the router object
