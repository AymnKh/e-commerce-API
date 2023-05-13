import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";


//enable cors
app.use(cors());
app.options("*", cors());

//dotenv config
dotenv.config();

const app = express();
const port = 3000;

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to mongodb
mongoose.connect(
  process.env.DATA_BASE_URL,
  {
    useNewUrlParser: true,
  },
  (err) => {
    err ? console.log(err) : console.log("Connected to database");
  }
);

//connect to server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
