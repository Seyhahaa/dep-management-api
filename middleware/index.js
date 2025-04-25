const expressAsyncHandler = require("express-async-handler");
const authModel = require("../src/Models/UserModel");
const jwt = require("jsonwebtoken");

const handleError = (err, req, res, next) => {
    return res.status(400).json(err.message);
  };
  const verifyJWT = expressAsyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const extract = token.split(" ")[1];
    const decoded = jwt.verify(extract, process.env.JWT_SECRET);
    const user = await authModel.findById(decoded.data);
    //console.log(user)
    req.user = user;
    next();
  });
  
  module.exports = {
    handleError,
    verifyJWT,
  };