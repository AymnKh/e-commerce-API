import { isValidObjectId } from "mongoose";
import Product from "../models/product.js";
import Http from "http-status-codes";
export function addProduct(req, res) {
  const file = req.file;
  if (!file)
    return res
      .status(Http.NOT_FOUND)
      .json({ message: "No image in the request" });

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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
  let filter = {}; // Create a filter object
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") }; //  filter object
  }
  Product.find(filter) // Get all products from the database
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
export function updateProduct(req, res) {
  const newProduct = {
    // Create a new product object
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
  };
  const id = req.params.id; // Get the product id from the request
  if (!isValidObjectId(id)) {
    // If the product id is not a valid object id
    return res.status(Http.BAD_REQUEST).json({
      success: false,
      message: "Invalid product id", // Return an error message
    });
  }
  Product.findByIdAndUpdate(id, newProduct, { new: true }) // Find the product by id and update it
    .then((result) => {
      if (!result) {
        // If the product is not found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Product not found", // Return an error message
        });
      }
      return res.status(Http.OK).json({
        // If the Product is found and updated
        success: true,
        message: "Product updated", // Return a success message
        Product: result,
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
export function deleteProduct(req, res) {
  const id = req.params.id; // Get the product id from the request
  if (!isValidObjectId(id)) {
    // If the product id is not a valid object id
    return res.status(Http.BAD_REQUEST).json({
      success: false,
      message: "Invalid product id", // Return an error message
    });
  }
  Product.findByIdAndRemove(id) // Find the product by id and delete it
    .then((result) => {
      if (!result) {
        // If the product is not found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Product not found", // Return an error message
        });
      }
      return res.status(Http.OK).json({
        // If the product is found and deleted
        success: true,
        message: "Product deleted", // Return a success message
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
export function getFeaturedProducts(req, res) {
  Product.find({ isFeatured: true }) // Find all featured products
    .populate("category") // Populate the category field
    .select("-__v") // Exclude the __v field
    .then((products) => {
      if (products.length < 1) {
        // If no featured products are found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "No featured products found",
        });
      }
      // If the featured products are found successfully
      return res.status(Http.OK).json({
        success: true,
        products: products,
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
export function getProductsCount(req, res) {
  Product.countDocuments((count) => {
    // Count all products
    if (count < 1) {
      // If no products are found
      return res.status(Http.NOT_FOUND).json({
        success: false,
        message: "No products found",
      });
    }
    // If the products are found successfully
    return res.status(Http.OK).json({
      success: true,
      count: count,
    });
  });
}
export function uploadGalleryImages(req, res) {
  const productId = req.params.id; // Get the product id from the request
  if (!isValidObjectId(productId)) {
    // If the product id is not a valid object id
    return res.status(Http.BAD_REQUEST).json({
      success: false,
      message: "Invalid product id", // Return an error message
    });
  }
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }
  Product.findByIdAndUpdate(
    {
      _id: productId,
    },
    {
      images: imagesPaths,
    }
  )
    .then((result) => {
      if (!result) {
        // If the product is not found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Product not found", // Return an error message
        });
      }
      return res.status(Http.OK).json({
        // If the product is found and deleted
        success: true,
        message: "Product updated", // Return a success message
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
