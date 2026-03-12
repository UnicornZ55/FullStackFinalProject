import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { addTokenToBlacklist } from "../utils/tokenBlacklist.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const register = async (req, res) => {
  const user = await User.create(req.body);
  generateToken(res, user._id);
  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  const failDelayMs = 2000;

  if (user && user.isDeleted) {
    await delay(failDelayMs);
    return res.status(403).json({ message: "User account deleted" });
  }

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json(user);
  } else {
    await delay(failDelayMs);
    res.status(401).json({ message: "Invalid credentials" });
  }
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    addTokenToBlacklist(token);
  }

  res.cookie("jwt", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 0,
  });

  res.json({ message: "Logged out" });
};