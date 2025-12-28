import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useMemo } from "react";
import api from "@/services/api.service";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { Button } from "@/components/common/Button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  Maximize2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function VideoCall({
  channelName,
  onEndCall,
  sessionId,
  token,
  uid,
  tokenError,
  isTokenLoading,
  isConnected,
  isJoining,
  joinError
}: {
  channelName: string;
  onEndCall: () => void;
  sessionId: string | null;
  token: string | null;
  uid: number | string | null;
  tokenError: string | null;
  isTokenLoading: boolean;
  isConnected: boolean;
  isJoining: boolean;
  joinError: any;
}) {
  const navigate = useNavigate();

  // Redirect to login if session requires auth but user isn't authenticated
  useEffect(() => {
    if (tokenError && (tokenError.includes("Not authorized") || tokenError.includes("no token"))) {
      navigate('/login');
    }
  }, [tokenError, navigate]);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');

  // Local tracks
  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack, error: camError } = useLocalCameraTrack(cameraOn);

  // Remote users
  const remoteUsers = useRemoteUsers();

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const handleEndCall = async () => {
    if (sessionId) {
      if (confirm("Are you sure you want to end the session for everyone?")) {
        try {
          await api.put(`/sessions/${sessionId}/end`);
          onEndCall();
        } catch (err) {
          console.error("Failed to end session", err);
          alert("Failed to end session. You might not be the host.");
          onEndCall(); // Leave anyway
        }
      }
    } else {
      onEndCall();
    }
  };

  // Handle Token Errors
  if (tokenError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white p-4">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-md text-center">
          <PhoneOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Token Error</h2>
          <p className="text-gray-300 mb-4">{tokenError}</p>
          <Button onClick={onEndCall} variant="secondary">Go Back</Button>
        </div>
      </div>
    );
  }

  // Handle Join Errors
  if (joinError) {
    const agoraError = joinError as any;
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white p-4">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-md text-center">
          <PhoneOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Connection Failed</h2>
          <p className="text-gray-300 mb-4">
            {agoraError.name === "AgoraRTCError" && agoraError.code === "CAN_NOT_GET_GATEWAY_SERVER"
              ? "Invalid App ID or Network Issue."
              : joinError.message}
          </p>
          {joinError.message.includes("DYNAMIC_KEY_TIMEOUT") && (
            <p className="text-sm text-yellow-400 mb-4 bg-yellow-400/10 p-2 rounded">
              Token expired or invalid. attempting to refresh...
            </p>
          )}
          <Button onClick={onEndCall} variant="secondary">Go Back</Button>
        </div>
      </div>
    );
  }

  // Loading State
  if (isTokenLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-400 font-medium">Securing connection...</p>
      </div>
    );
  }

  // Handle Permission Errors
  if (micError || camError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white p-4">
        <div className="bg-yellow-500/10 border border-yellow-500/50 p-6 rounded-2xl max-w-md text-center">
          <VideoOff className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Permissions Error</h2>
          <p className="text-gray-300 mb-4">
            We couldn't access your camera or microphone. Please allow permissions in your browser settings.
          </p>
          <Button onClick={onEndCall} variant="secondary">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group">
            <LocalVideoTrack
              track={localCameraTrack}
              play={cameraOn}
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror local video
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-10">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              <span className="text-white text-sm font-medium">You {isJoining && '(Joining...)'}</span>
              {!micOn && <MicOff className="w-3 h-3 text-red-400 ml-1" />}
            </div>

            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Remote Users */}
          {remoteUsers.map((user) => (
            <div
              key={user.uid}
              className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
            >
              <RemoteUser user={user} playVideo={true} playAudio={true} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-10">
                <span className="text-white text-sm font-medium truncate max-w-[100px]">User {user.uid}</span>
              </div>
            </div>
          ))}

          {/* Placeholder for empty grid if few users */}
          {remoteUsers.length === 0 && isConnected && (
            <div className="hidden md:flex items-center justify-center bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Waiting for others to join...</p>
                <div className="mt-2 text-xs bg-gray-800 px-2 py-1 rounded inline-block">
                  Channel: {channelName}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls Bar */}
        <div className="h-20 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-4">
            <div className="text-white font-semibold flex flex-col">
              <span>{channelName}</span>
              <span className="text-xs text-gray-500 font-normal">
                {remoteUsers.length} online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setMicOn(!micOn)}
              className={`rounded-full w-12 h-12 p-0 transition-all ${!micOn ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/50' : 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700'}`}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => setCameraOn(!cameraOn)}
              className={`rounded-full w-12 h-12 p-0 transition-all ${!cameraOn ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/50' : 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700'}`}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <Button
              variant="danger"
              size="lg"
              onClick={handleEndCall}
              className="rounded-full px-6 bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg shadow-red-900/20"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              {sessionId ? 'End Session' : 'Leave'}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                setActiveTab('participants');
              }}
              className={`text-gray-400 hover:text-white ${sidebarOpen && activeTab === 'participants' ? 'bg-gray-800 text-white' : ''}`}
            >
              <Users className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                setActiveTab('chat');
              }}
              className={`text-gray-400 hover:text-white ${sidebarOpen && activeTab === 'chat' ? 'bg-gray-800 text-white' : ''}`}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col transition-all duration-300 ease-in-out">
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            <h3 className="font-semibold text-white">
              {activeTab === 'chat' ? 'Live Chat' : 'Participants'}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <Maximize2 className="w-4 h-4 text-gray-400" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'participants' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">You (Host)</p>
                    <p className="text-xs text-gray-500">Camera on • Mic on</p>
                  </div>
                </div>
                {remoteUsers.map(user => (
                  <div key={user.uid} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>U{String(user.uid).slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">User {user.uid}</p>
                      <p className="text-xs text-gray-500">Attendee</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col h-full justify-center items-center text-gray-500 text-sm">
                <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                <p>Chat is empty</p>
              </div>
            )}
          </div>

          {activeTab === 'chat' && (
            <div className="p-4 border-t border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-gray-800 text-white rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-300">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Wrapper component to use hooks that require AgoraRTCProvider
function WrapperVideoCall(props: any) {
  const { isConnected, error: joinError, isLoading: isJoining } = useJoin({
    appid: import.meta.env.VITE_AGORA_APP_ID,
    channel: props.channelName,
    token: props.token,
    uid: props.uid,
  }, !!props.token);

  return <VideoCall {...props} isConnected={isConnected} joinError={joinError} isJoining={isJoining} />;
}

export default function LiveSession() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [inCall, setInCall] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [uid, setUid] = useState<number | string | null>(null);
  const [channel, setChannel] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Waiting room state
  const [isHost, setIsHost] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [wasInWaitingRoom, setWasInWaitingRoom] = useState(false);

  // Memoize RTC client to prevent recreation on every render
  const client = useMemo(() => AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }), []);

  // Check session status (for waiting room)
  useEffect(() => {
    const checkSessionStatus = async () => {
      try {
        const response = await api.get(`/sessions/${eventId}/status`);
        if (response.data.success) {
          setIsHost(response.data.data.isHost);
          setSessionStarted(response.data.data.sessionStarted);
          if (response.data.data.sessionId) {
            setSessionId(response.data.data.sessionId);
          }
        }
      } catch (err: any) {
        console.error("Error checking session status:", err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setStatusLoading(false);
      }
    };

    if (eventId) {
      checkSessionStatus();
    }
  }, [eventId, navigate]);

  // Poll for session start (only for non-hosts when session not started)
  useEffect(() => {
    if (isHost || sessionStarted || statusLoading) return;

    // Mark that user is in waiting room
    setWasInWaitingRoom(true);

    const pollInterval = setInterval(async () => {
      try {
        const response = await api.get(`/sessions/${eventId}/status`);
        if (response.data.success && response.data.data.sessionStarted) {
          setSessionStarted(true);
          if (response.data.data.sessionId) {
            setSessionId(response.data.data.sessionId);
          }
        }
      } catch (err) {
        console.error("Error polling session status:", err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [eventId, isHost, sessionStarted, statusLoading]);

  // Fetch token when ready to join
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsTokenLoading(true);
        const channelName = eventId;
        if (!channelName) return;

        const response = await api.get(`/sessions/${channelName}/token`);
        if (response.data.success) {
          setToken(response.data.token);
          setUid(response.data.uid);
          setChannel(response.data.channel);
          if (response.data.sessionId) {
            setSessionId(response.data.sessionId);
          }
        } else {
          setTokenError("Failed to fetch token");
        }
      } catch (err: any) {
        console.error("Error fetching token:", err);
        setTokenError(err.response?.data?.message || err.message || "Failed to generate token");
      } finally {
        setIsTokenLoading(false);
      }
    };

    // Only fetch token when session is started (for non-hosts) or always for hosts
    if (eventId && (isHost || sessionStarted)) {
      fetchToken();
    }
  }, [eventId, isHost, sessionStarted]);

  // Auto-join when session starts for users who were in waiting room
  useEffect(() => {
    if (wasInWaitingRoom && sessionStarted && token && !inCall) {
      // Automatically join the call when session starts and token is ready
      setInCall(true);
    }
  }, [wasInWaitingRoom, sessionStarted, token, inCall]);

  // Show loading while checking session status
  if (statusLoading) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-400 font-medium">Checking session status...</p>
        </div>
      </div>
    );
  }

  // Waiting Room UI for non-hosts when session hasn't started
  if (!isHost && !sessionStarted) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="max-w-md w-full p-8 text-center">
          <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <div className="w-16 h-16 bg-indigo-600/30 rounded-full flex items-center justify-center animate-pulse">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Waiting Room</h1>
          <p className="text-gray-400 mb-6">
            The host hasn't started the session yet. You'll be automatically connected when the session begins.
          </p>
          <div className="flex items-center justify-center gap-2 text-indigo-400 mb-8">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="ml-2 text-sm">Waiting for host to start...</span>
          </div>
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            Leave Waiting Room
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 flex items-center justify-center">
      {!inCall ? (
        <div className="max-w-md w-full p-8 text-center">
          {isTokenLoading && <p className="text-indigo-400 mb-4">Preparing session...</p>}
          {tokenError && <p className="text-red-500 mb-4">{tokenError}</p>}

          {!isTokenLoading && !tokenError && (
            <>
              <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Video className="w-10 h-10 text-indigo-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Ready to join?</h1>
              <p className="text-gray-400 mb-8">
                You are about to join the live session. Please check your camera and microphone settings.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => setInCall(true)}
                  variant="gradient"
                  size="lg"
                  className="w-full h-14 text-lg shadow-lg shadow-indigo-500/20"
                >
                  Join Session Now
                </Button>
                <Button
                  onClick={() => navigate(-1)}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                >
                  Go Back
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <AgoraRTCProvider client={client}>
          <WrapperVideoCall
            channelName={channel || ""}
            onEndCall={() => setInCall(false)}
            token={token}
            uid={uid}
            sessionId={sessionId}
            tokenError={tokenError}
            isTokenLoading={isTokenLoading}
          />
        </AgoraRTCProvider>
      )}
    </div>
  );
}

