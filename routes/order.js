import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  userOrders,
} from "../controllers/order.js";
const router = express.Router(); // Create a router object

router.post("/add", createOrder); // add order
router.get("/", getAllOrders); // get all orders
router.get("/user/:id", userOrders); // get all user orders
router.route("/:id").get(getOrderById).delete(deleteOrder).put(updateOrder); // get , delete , update order by id

export default router; //export router
