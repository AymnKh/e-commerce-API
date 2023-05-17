import User from "../models/user.js";
import Bcrypt from "bcryptjs";
import Http from "http-status-codes";
import Jwt from "jsonwebtoken";
import { validateEgyptPhoneNumber } from "../helpers/userHelper.js";

export async function register(req, res) {
  const phoneNumber = validateEgyptPhoneNumber(req.body.phone); //validate phone number
  if (!phoneNumber) {
    //if phone number is not valid
    return res.status(Http.BAD_REQUEST).json({
      success: false,
      message: "Invalid phone number", //return error message
    });
  }
  const newEmail = req.body.email && req.body.email.toLowerCase(); //convert email to lowercase
  const newPhone = req.body.phone && req.body.phone;
  const exsist = await User.findOne({
    //check if user already exists
    $or: [
      {
        email: newEmail,
      },
      {
        phone: newPhone,
      },
    ],
  });
  if (exsist) {
    //if user already exists
    return res.status(Http.BAD_REQUEST).json({
      success: false,
      message: "User already exists", //return error message
    });
  }
  return Bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        //if error
        success: false,
        message: "Server error",
        error: err,
      });
    }
    const newUser = new User({
      //create new user
      name: req.body.name,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    User.create(newUser) //save new user
      .then((result) => {
        if (!result) {
          return res.status(Http.BAD_REQUEST).json({
            success: false,
            message: "User not created", //return error message
          });
        }
        const token = Jwt.sign(
          {
            userId: result._id,
            isAdmin: result.isAdmin,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        ); //create token
        return res.status(Http.CREATED).json({
          //if user created
          success: true,
          message: "User created",
          token: token,
        });
      })
      .catch((err) => {
        return res.status(Http.INTERNAL_SERVER_ERROR).json({
          //if error
          success: false,
          message: "Server error",
          error: err._message,
        });
      });
  });
}
export function getUserList(req, res) {
  User.find({}) //get all users
    .select("-password") //exclude password
    .sort({ createdAt: -1 }) //sort by createdAt
    .then((result) => {
      if (result.length === 0) {
        //if no users found
        return res.status(Http.NOT_FOUND).json({
          success: false,
          message: "Users not found", //return error message
        });
      }
      return res.status(Http.OK).json({
        //if users found
        success: true,
        message: "Users found",
        users: result,
      });
    })
    .catch((err) => {
      //if error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error", //return error message
        error: err._message,
      });
    });
}
export function login(req, res) {
  const email = req.body.email && req.body.email.toLowerCase(); //convert email to lowercase
  User.findOne({
    //find user by email
    email,
  })
    .then((result) => {
      if (!result) {
        return res.status(Http.NOT_FOUND).json({
          //if user not found
          success: false,
          message: "User not found",
        });
      }
      return Bcrypt.compare(req.body.password, result.password, (err, data) => {
        //compare password
        if (err) {
          return res.status(Http.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server error",
            error: err, //return error message
          });
        }
        if (!data) {
          //if password not correct
          return res.status(Http.BAD_REQUEST).json({
            success: false,
            message: "Invalid password", //return error message
          });
        }
        const token = Jwt.sign(
          {
            userId: result._id,
            isAdmin: result.isAdmin,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        ); //create token
        return res.status(Http.OK).json({
          //if user logged in
          success: true,
          message: "User logged in",
          token: token,
        });
      });
    })
    .catch((err) => {
      //if error
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: err._message, //return error message
      });
    });
}
export async function updateUser(req, res) {
  const id = req.params.id; //get user id
  const userData = await User.findById(id); //get user data
  let newPassword; //define new password
  req.body.password
    ? (newPassword = Bcrypt.hashSync(req.body.password, 10))
    : (newPassword = userData.password); //if password is provided, hash it, else use old password

  User.findByIdAndUpdate(
    id,
    {
      //update user data
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: newPassword,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  ) //return updated user data
    .then((result) => {
      if (!result) {
        //if user not found
        return res.status(Http.NOT_FOUND).json({
          success: false, //return error message
          message: "User not found",
        });
      }
      return res.status(Http.OK).json({
        //if user updated
        success: true,
      });
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        //if error
        success: false,
        message: "Server error", //return error message
        error: err._message,
      });
    });
}
