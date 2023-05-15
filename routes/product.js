import express from 'express';
import { addProduct, getProducts } from "../controllers/product.js";

const router = express.Router();

router.post('/add', addProduct); // add Product
router.route('/').get(getProducts); // get all Products

export default router;