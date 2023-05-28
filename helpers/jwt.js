import JWT from "express-jwt";
import jwt from "jsonwebtoken";
const authJwt = () => {
  return JWT.expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    // isRevoked: isRevoked,
    getToken: (req) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        const token = req.headers.authorization.split(" ")[1]; //return token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return null;
          }
          req.user = decoded;
        });
        return token;
      }
      return null;
    },
  }).unless({
    path: [
      { url: "/api/v1/", methods: ["GET"] },
      { url: "/api/v1/login", methods: ["POST"] },
      { url: "/api/v1/register", methods: ["POST"] },
      //public uploads
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
    ],
  });
};

// const isRevoked = async (req, payload, done) => {
//   if (!payload.isAdmin) {
//     done(null, true);
//   }

//   done();
// };

export default authJwt;
