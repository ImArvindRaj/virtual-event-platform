import e, { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { getDatabase } from "../utils/db";

const router = Router();

// Create a new event
// POST /api/events
router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
  const { title, description, scheduledTime } = req.body;
 console.log(req.user)
  if (!title || !description || !scheduledTime) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  const db = getDatabase();

  const newEvent = {
    title,
    description: description || "",
    scheduledTime: new Date(scheduledTime),
    createdBy: req.user.userId,
    createdAt: new Date(),
  };

  const result = await db.collection("events").insertOne(newEvent);
  res.status(201).json({
    message: "Event created",
    eventId: result.insertedId,
  });
});

//list all events
// GET /api/events
router.get("/", authenticate, async (req: AuthenticatedRequest, res) => {
  const db = getDatabase();
  const events = await db.collection("events").find().toArray();
  res.status(200).json(events);
});

export default router;