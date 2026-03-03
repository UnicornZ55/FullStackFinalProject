import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  const user = await User.create(req.body);
  generateToken(res, user._id);
  res.json(user);
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && (await user.matchPassword(req.body.password))) {
    generateToken(res, user._id);
    res.json(user);
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};