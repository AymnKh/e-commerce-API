import Product from "../models/product.js";
import Http from "http-status-codes";
export function addProduct(req, res) {
  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
  }); // Create a new category instance

  newProduct
    .save() // Save the category
    .then((result) => {
      // If the category is saved successfully
      return res.status(Http.CREATED).json({
        success: true,
        message: "Product added successfully", // Return a success message
        product: result, // Return the new category
      });
    })
    .catch((err) => {
      // If there is a server error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err._message,
      });
    });
}
export function getProducts(req, res) {
  Product.find({}) // Get all products from the database
    .populate("category") // Populate the category field
    .select("-__v") // Exclude the __v field
    .then((products) => {
      if (products.length < 1) {
        // If no products are found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "No products found",
        });
      }
      // If the products are found successfully
      return res.status(Http.OK).json({
        success: true,
        products: products,
      });
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err._message,
      });
    });
}
