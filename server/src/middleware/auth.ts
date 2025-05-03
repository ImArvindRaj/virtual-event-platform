import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any; // Define the type of user if you have a specific structure
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Authorization header missing" });
     return
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
     res.status(401).json({ message: "Token missing" });
     return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
     res.status(401).json({ message: "Invalid token" });
  }
};
