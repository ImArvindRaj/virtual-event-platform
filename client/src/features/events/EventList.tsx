import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../services/api.service";
import { Event } from "../../types";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await api.get("/events");
      setEvents(data.data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link
          to="/events/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Event
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="border rounded-lg p-4 shadow">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <span
              className={`px-2 py-1 rounded text-sm ${
                event.status === "live"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100"
              }`}
            >
              {event.status}
            </span>
            {event.status === "live" && (
              <Link
                to={`/events/${event._id}/live`}
                className="block mt-4 text-blue-600"
              >
                Join Session
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
