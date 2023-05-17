import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import categoryRoute from "./routes/category.js";
import productRoute from "./routes/product.js";
import UserRoute from "./routes/user.js";
import authJwt from "./helpers/jwt.js";

const app = express();
//enable cors
app.use(cors());
app.options("*", cors());

//dotenv config
dotenv.config();

const port = 3000;

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to mongodb
mongoose
  .connect(process.env.DATA_BASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
  });

//middleware
app.use(authJwt()); //use jwt middleware
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1", UserRoute);

//connect to server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
