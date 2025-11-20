import React, { useEffect, useState } from "react";
import { format, isWithinInterval, subMinutes, addMinutes } from "date-fns";
import { api } from "../utils/api";

interface Event {
  id: string;
  title: string;
  description: string;
  scheduledTime: string;
  attendeeCount?: number;
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const now = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const register = async (eventId: string) => {
    try {
      await api.post(`/events/${eventId}/register`);
      alert("Registered successfully!");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to register for the event.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      {events.map((e) => {
        const when = new Date(e.scheduledTime);
        const canJoin = isWithinInterval(now, {
          start: subMinutes(when, 10),
          end: addMinutes(when, 10),
        });
        return (
          <div key={e.id} className="border rounded p-4">
            <h2 className="text-xl font-bold">{e.title}</h2>
            <p>{format(when, "PPpp")}</p>
            <p>{e.description}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => register(e.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Register
              </button>
              {canJoin && (
                <a
                  href={`/event/${e.id}/video`}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Join Video
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
