import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../services/api.service";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Users, Type, AlignLeft, ArrowLeft, Upload } from "lucide-react";
import showToast from "@/utils/toast";

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

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.scheduledAt) {
      newErrors.scheduledAt = "Scheduled time is required";
    } else {
      const selectedDate = new Date(formData.scheduledAt);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.scheduledAt = "Scheduled time must be in the future";
      }
    }

    if (formData.maxAttendees < 2) {
      newErrors.maxAttendees = "At least 2 attendees required";
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
      await api.post("/events", formData);
      showToast.success("Event created successfully!");
      navigate("/");
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message || "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-transparent hover:text-indigo-600 pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        <div className="grid gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Event</h1>
            <p className="text-gray-500 dark:text-gray-400">Fill in the details to host your next amazing virtual event.</p>
          </div>

          <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Event Details</h2>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <Input
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Global Tech Conference 2024"
                  error={errors.title}
                  leftIcon={<Type className="w-5 h-5" />}
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full p-4 rounded-xl border bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-950 transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 ${errors.description
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 dark:border-gray-800 focus:border-indigo-500"
                      }`}
                    placeholder="Describe what your event is about..."
                  />
                  {errors.description && (
                    <p className="text-xs text-red-600 font-medium">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Date & Time"
                    name="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    min={getMinDateTime()}
                    error={errors.scheduledAt}
                    leftIcon={<Calendar className="w-5 h-5" />}
                    required
                  />

                  <Input
                    label="Max Attendees"
                    name="maxAttendees"
                    type="number"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    min={2}
                    max={1000}
                    error={errors.maxAttendees}
                    leftIcon={<Users className="w-5 h-5" />}
                    required
                    helperText="Limit between 2 and 1000 attendees"
                  />
                </div>

                {/* Cover Image Placeholder - Future Feature */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Cover Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50 group">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    isLoading={loading}
                    className="min-w-[150px] shadow-lg shadow-indigo-500/25"
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
