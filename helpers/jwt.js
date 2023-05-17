import JWT from "express-jwt";
const authJwt = () => {
  return JWT.expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: "/api/v1/login", methods: ["POST"] },
      { url: "/api/v1/register", methods: ["POST"] },
    ],
  });
};

const isRevoked = async (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
};

export default authJwt;
