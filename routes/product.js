import express from "express";
import { addProduct, getProducts, uploadGalleryImages } from "../controllers/product.js";
import upload from "../helpers/imageUpload.js";

const router = express.Router();

router.post("/add", upload.single("image"), addProduct); // add Product
router.put(
  "/upload-images/:id",
  upload.array("images", 10),
  uploadGalleryImages
);
router.route("/").get(getProducts); // get all Products

export default router;
