import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api.service";

export default function EventCreate() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    maxAttendees: 100,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    // Scheduled time validation
    if (!formData.scheduledAt) {
      newErrors.scheduledAt = "Scheduled time is required";
    } else {
      const selectedDate = new Date(formData.scheduledAt);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.scheduledAt = "Scheduled time must be in the future";
      }
    }

    // Max attendees validation
    if (formData.maxAttendees < 2) {
      newErrors.maxAttendees = "At least 2 attendees required";
    } else if (formData.maxAttendees > 1000) {
      newErrors.maxAttendees = "Maximum 1000 attendees allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxAttendees" ? parseInt(value) || 0 : value,
    }));

    // Clear error when user modifies field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/events", formData);
      console.log(data);

      navigate("/");
    } catch (error: any) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to create event. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Create New Event
        </h2>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Tech Conference 2025"
              maxLength={100}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
              <span className="text-gray-400 text-sm ml-auto">
                {formData.title.length}/100
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe your event, what attendees can expect, topics to be covered..."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <span className="text-gray-400 text-sm ml-auto">
                {formData.description.length}/500
              </span>
            </div>
          </div>

          {/* Scheduled Time */}
          <div>
            <label
              htmlFor="scheduledAt"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Scheduled Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="scheduledAt"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              min={getMinDateTime()}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.scheduledAt ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.scheduledAt && (
              <p className="text-red-500 text-sm mt-1">{errors.scheduledAt}</p>
            )}
          </div>

          {/* Max Attendees */}
          <div>
            <label
              htmlFor="maxAttendees"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maximum Attendees <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              min={2}
              max={1000}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.maxAttendees ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.maxAttendees && (
              <p className="text-red-500 text-sm mt-1">{errors.maxAttendees}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Between 2 and 1000 participants
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 p-3 rounded-lg font-semibold text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
