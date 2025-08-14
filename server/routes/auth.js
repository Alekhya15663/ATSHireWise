const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

router.post("/register", async (req, res) => {
  console.log("Incoming registration:", req.body);

  try {
    const { name, email, password, role = "applicant" } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, msg: "All fields are required!" });

    
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) {
      return res.status(400).json({ success: false, msg: "Email already registered!" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashed, role]
    );

    const payload = { id: result.insertId, name, role };
    const token = signToken(payload);

    return res.status(201).json({
      success: true,
      token,
      name,
      role
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, msg: "Something went wrong!" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid credentials" });
    }

  
    const payload = { id: user.id, name: user.name, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      token,
      name: user.name,
      role: user.role
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;