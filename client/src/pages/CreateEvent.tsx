import React, { useState } from "react";
import { getAuthToken } from "../utils/auth";
import { api } from "../utils/api";
import "./../index.css";

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }
    try {
      const response = await api.post("/events", {
        title,
        description,
        scheduledTime,
      });

      console.log("Event created successfully:", response.data);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Create Event</h1>
      <div className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
        />
        <button
          onClick={submitEvent}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateEvent;
