const USERS = require("../models/users");
const jwt = require("jsonwebtoken");

verify_token = async (req, res, next) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(403).send({
        status: 403,
        message: "No token provided!",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    const user = await USERS.findOne({ _id: decoded._id });
    // console.log(user);
    if (!user) {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized!",
      });
    }
    req.user = user;
    req.role = user.role;
    req.id = user._id;

    next();
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = verify_token;
