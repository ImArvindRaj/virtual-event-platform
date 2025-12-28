import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import api from "../../services/api.service";
import { Event } from "../../types";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, Share2, ArrowLeft, Video } from "lucide-react";
import { Spinner } from "@/components/common";
import { useAuth } from "../../context/AuthContext";

export default function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${eventId}`);
                setEvent(data.data);
            } catch (error) {
                console.error("Failed to fetch event details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    // Check if current user is the host (compare as strings for safety)
    const isHost = isAuthenticated && user && (
        event?.organizer?._id?.toString() === user._id?.toString() ||
        event?.hostId?.toString() === user._id?.toString()
    );

    // Check if current user is already registered
    const isRegistered = isAuthenticated && user && event?.attendees?.some(
        (attendeeId: any) => attendeeId?.toString() === user._id?.toString()
    );

    const handleActionClick = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (event?.status === 'live') {
            // Anyone can join a live session
            navigate(`/events/${event._id}/live`);
        } else if (isHost) {
            // Host can start the session
            if (event?.status === 'upcoming') {
                try {
                    setLoading(true);
                    await api.post('/sessions/start', { eventId: event._id });
                    navigate(`/events/${event._id}/live`);
                } catch (err: any) {
                    console.error("Failed to start session", err);
                    alert(err.response?.data?.message || "Failed to start session");
                    setLoading(false);
                }
            } else {
                alert("This event cannot be started.");
            }
        } else if (isRegistered) {
            // Registered attendee can join waiting room
            navigate(`/events/${event?._id}/live`);
        } else {
            // Not registered - register for the event
            try {
                setLoading(true);
                await api.post(`/events/${event?._id}/join`);
                // Refresh event data to update attendees list
                const { data } = await api.get(`/events/${eventId}`);
                setEvent(data.data);
                alert("Successfully registered for the event!");
            } catch (err: any) {
                console.error("Failed to register", err);
                alert(err.response?.data?.message || "Failed to register for event");
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event not found</h2>
                <Link to="/">
                    <Button variant="primary">Back to Events</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            {/* Hero Banner */}
            <div className="relative h-[400px] bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
                    <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Events
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant={event.status === 'live' ? 'destructive' : 'secondary'} className="bg-white/20 text-white border-0 backdrop-blur-md">
                                    {event.status === 'live' && <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />}
                                    {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                                </Badge>
                                <span className="text-indigo-200 text-sm font-medium flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {event.attendees?.length || 0} attendees
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-400" />
                                    <span>{new Date(event.scheduledAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                    <span>{new Date(event.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 backdrop-blur-md">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            {/* Render different buttons based on role and status */}
                            {event.status === 'live' ? (
                                <Button
                                    onClick={handleActionClick}
                                    variant="gradient"
                                    size="lg"
                                    className="shadow-lg shadow-indigo-500/30 animate-pulse"
                                >
                                    <Video className="w-5 h-5 mr-2" />
                                    Join Live Session
                                </Button>
                            ) : isHost ? (
                                <Button
                                    onClick={handleActionClick}
                                    variant="gradient"
                                    size="lg"
                                    className="shadow-lg shadow-indigo-500/30"
                                >
                                    <Video className="w-5 h-5 mr-2" />
                                    Start Session
                                </Button>
                            ) : isRegistered ? (
                                <Button
                                    onClick={handleActionClick}
                                    variant="gradient"
                                    size="lg"
                                    className="shadow-lg shadow-indigo-500/30"
                                >
                                    <Video className="w-5 h-5 mr-2" />
                                    Join Waiting Room
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleActionClick}
                                    variant="primary"
                                    size="lg"
                                    className="shadow-lg shadow-indigo-500/30"
                                >
                                    Register Now
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-gray-200 dark:border-gray-800">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About this event</h2>
                                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                    <p className="whitespace-pre-wrap leading-relaxed">{event.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 dark:border-gray-800">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Host</h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {event.organizer?.name?.charAt(0) || 'H'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{event.organizer?.name || 'Event Organizer'}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">Host</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-gray-200 dark:border-gray-800 sticky top-24">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Event Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Date</p>
                                            <p className="text-sm text-gray-500">{new Date(event.scheduledAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Time</p>
                                            <p className="text-sm text-gray-500">{new Date(event.scheduledAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Video className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Location</p>
                                            <p className="text-sm text-gray-500">Virtual Event</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    {isHost ? (
                                        <Button
                                            onClick={handleActionClick}
                                            variant="gradient"
                                            className="w-full shadow-md"
                                        >
                                            {event.status === 'live' ? 'Join Session' : 'Start Session'}
                                        </Button>
                                    ) : event.status === 'live' ? (
                                        <Button
                                            onClick={handleActionClick}
                                            variant="gradient"
                                            className="w-full shadow-md"
                                        >
                                            Join Now
                                        </Button>
                                    ) : isRegistered ? (
                                        <Button
                                            onClick={handleActionClick}
                                            variant="gradient"
                                            className="w-full shadow-md"
                                        >
                                            Join Waiting Room
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleActionClick}
                                            variant="gradient"
                                            className="w-full shadow-md"
                                        >
                                            Register for Event
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
