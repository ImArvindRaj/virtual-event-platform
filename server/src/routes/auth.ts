import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { getDatabase } from "../utils/db";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const db = getDatabase();
  const usersCollection = db.collection("users");

  const existingEmail = await usersCollection.findOne({ email });
  if (existingEmail) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }
  const existingUsername = await usersCollection.findOne({ username });
  if (existingUsername) {
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  const generateUserId = v4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    user_id: generateUserId,
    username,
    password: hashedPassword,
    email,
  };
  try {
    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(result, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    console.log("Token:", token);
    res
      .status(201)
      .json({ message: "User created", userId: result.insertedId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = getDatabase();
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ username });
  if (!user) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }
  const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  res.status(200).json({ message: "Login successful", token, user });
});

router.get("/me", authenticate, async (req: AuthenticatedRequest, res) => {
  const db = getDatabase();
  const usersCollection = db.collection("users");
  const userId = req.user.userId;
  const user = await usersCollection.findOne(
    { user_id: userId },
    { projection: { password: 0 } }
  );

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return
  }
  res.status(200).json({ user });
});

export default router;

