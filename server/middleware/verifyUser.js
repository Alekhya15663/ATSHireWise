require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER RECEIVED:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ msg: "No auth header" });
  }

  const token = authHeader.split(" ")[1];
  console.log("TOKEN EXTRACTED:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("TOKEN DECODED:", decoded);

    if (decoded.role !== "applicant") {
      return res.status(403).json({ msg: "Only applicants can apply" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = verifyUser;
