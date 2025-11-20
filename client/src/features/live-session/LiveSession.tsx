import { useParams } from "react-router";
import { useState } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteUsers,
} from "agora-rtc-react";

export default function LiveSession() {
  const { eventId } = useParams();

  // Correct usage: pass created client to useRTCClient hook
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const [inCall, setInCall] = useState(false);

  return (
    <div className="h-screen bg-gray-900">
      {!inCall ? (
        <div className="flex items-center justify-center h-full">
          <button
            onClick={() => setInCall(true)}
            className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Join Event
          </button>
        </div>
      ) : (
        <AgoraRTCProvider client={client}>
          <VideoCall channelName={eventId || "default"} />
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setInCall(false)}
              className="px-8 py-4 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              End Call
            </button>
          </div>
        </AgoraRTCProvider>
      )}
    </div>
  );
}

function VideoCall({ channelName }: { channelName: string }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  // Local tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // Remote users
  const remoteUsers = useRemoteUsers();

  // Join channel
  useJoin({
    appid: import.meta.env.VITE_AGORA_APP_ID,
    channel: channelName,
    token: null,
  });

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Local Video */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <LocalVideoTrack
            track={localCameraTrack}
            play={cameraOn}
            className="w-full h-full"
          />
          <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
            You (Local)
          </div>
        </div>

        {/* Remote Users */}
        {remoteUsers.map((user) => (
          <div
            key={user.uid}
            className="relative bg-black rounded-lg overflow-hidden aspect-video"
          >
            <RemoteUser user={user} playVideo={true} playAudio={true} />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
              User {user.uid}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`px-6 py-3 rounded-full font-semibold ${
            micOn
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-red-600 hover:bg-red-700"
          } text-white`}
        >
          {micOn ? "🎤 Mute" : "🔇 Unmute"}
        </button>
        <button
          onClick={() => setCameraOn(!cameraOn)}
          className={`px-6 py-3 rounded-full font-semibold ${
            cameraOn
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-red-600 hover:bg-red-700"
          } text-white`}
        >
          {cameraOn ? "📹 Stop Video" : "📷 Start Video"}
        </button>
      </div>
    </div>
  );
}
