import express from "express";
import { addProduct, getProducts } from "../controllers/product.js";
import { verifyTokenAdmin } from "../helpers/jwt.js";

const router = express.Router();

router.post("/add", verifyTokenAdmin, addProduct); // add Product
router.route("/").get(getProducts); // get all Products

export default router;
