import Http from "http-status-codes";
import Jwt from "jsonwebtoken";
export function verifyToken(req, res, next) {
  if (!req.headers["authorization"]) {
    return res
      .status(Http.UNAUTHORIZED)
      .json({ success: false, message: "No token provided" }); //if no token provided
  }
  const token = req.headers["authorization"].split(" ")[1]; //get token from cookies or headers
  if (!token) {
    return res
      .status(Http.UNAUTHORIZED)
      .json({ success: false, message: "No token provided" }); //if no token provided
  }
  return Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(Http.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" }); //if token is invalid
    }
    req.userId = decoded.userId;
    return next();
  });
}
export function verifyTokenAdmin(req, res, next) {
  if (!req.headers["authorization"]) {
    return res
      .status(Http.UNAUTHORIZED)
      .json({ success: false, message: "No token provided" }); //if no token provided
  }
  const token = req.headers["authorization"].split(" ")[1]; //get token from cookies or headers
  if (!token) {
    return res
      .status(Http.UNAUTHORIZED)
      .json({ success: false, message: "No token provided" }); //if no token provided
  }
  return Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(Http.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" }); //if token is invalid
    }
    if (decoded.isAdmin) {
      req.userId = decoded.userId;
      return next();
    } else {
      return res
        .status(Http.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" }); //if token is invalid
    }
  });
}
