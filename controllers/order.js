import { isValidObjectId } from "mongoose";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import Http from "http-status-codes";

export async function createOrder(req, res) {
  const orderItemIds = await Promise.all(
    //create order items
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        //create new order item
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      const savedOrderItem = await OrderItem.create(newOrderItem); //save new order item
      return savedOrderItem._id; //return new order item id
    })
  ); //create order items

  const totalPrices = await Promise.all(
    //calculate total price
    orderItemIds.map(async (orderItemId) => {
      orderItemId = await OrderItem.findById(orderItemId).populate(
        //populate order item
        "product",
        "price"
      );
      const totalPrice = orderItemId.product.price * orderItemId.quantity; //calculate total price
      return totalPrice; //return total price
    })
  ); //calculate total price
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0); //calculate total price
  const order = {
    //create new order
    orderItems: orderItemIds, //order items
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  };
  Order.create(order) //create new order
    .then((data) => {
      return res.status(Http.CREATED).json(data); //return new order
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: err.message, //return error message
      });
    });
}
export function getAllOrders(req, res) {
  req.user.isAdmin //check if user is admin
    ? Order.find({}) //get all orders
        .populate("user", "name") //populate user name
        .populate({
          path: "orderItems", //populate order items
          populate: { path: "product", populate: "category" }, //populate product and category
        })
        .sort({ dateOrdered: -1 }) //sort by dateOrdered
        .then((data) => {
          return res.status(Http.OK).json(data); //return orders
        })
        .catch((err) => {
          //if error
          return res.status(Http.INTERNAL_SERVER_ERROR).json({
            message:
              err.message || "Some error occurred while retrieving orders.",
          });
        })
    : res.status(Http.UNAUTHORIZED).json({ message: "Unauthorized" }); //if user is not admin
}
export function getOrderById(req, res) {
  const id = req.params.id; //get order id
  Order.findById(id) //find order by id
    .populate("user", "name") //populate user name
    .populate({
      path: "orderItems", //populate order items
      populate: { path: "product", populate: "category" }, //populate product and category
    })
    .then((data) => {
      //if order found
      return res.status(Http.OK).json(data);
    })
    .catch((err) => {
      //if error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      });
    });
}
export async function updateOrder(req, res) {
  const id = req.params.id; //get order id
  Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status, //update order status
    },
    { new: true } //return updated order
  )
    .then((data) => {
      //if order updated
      return res.status(Http.OK).json(data);
    })
    .catch((err) => {
      //if error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      });
    });
}
export async function deleteOrder(req, res) {
  const id = req.params.id; //get order id
  if (!isValidObjectId(id)) {
    return res.status(Http.BAD_REQUEST).json({ message: "Invalid order id" }); //if invalid order id
  }
  const orderDetails = await Order.findById(id); //find order by id
  if (!orderDetails) {
    return res.status(Http.NOT_FOUND).json({ message: "Order not found" }); //if order not found
  }
  const orderItemsIds = await Promise.all(
    //resolve order item ids
    //delete order items
    orderDetails.orderItems.map(async (orderItem) => {
      await OrderItem.findByIdAndRemove(orderItem); //find order item by id and remove
    })
  );

  Order.findByIdAndRemove(id) //find order by id and remove
    .then((data) => {
      //if order removed
      return res.status(Http.OK).json({
        message: "Order was deleted successfully!",
      });
    })
    .catch((err) => {
      //if error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      });
    });
}
export function userOrders(req, res) {
  const id = req.params.id; //get user id
  Order.find({ user: id }) //find order by id
    .populate("user", "name") //populate user name
    .populate({
      path: "orderItems", //populate order items
      populate: { path: "product", populate: "category" }, //populate product and category
    })
    .then((data) => {
      //if order found
      return res.status(Http.OK).json(data);
    })
    .catch((err) => {
      //if error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: err.message,
      });
    });
}
