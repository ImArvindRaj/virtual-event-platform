import api from "./api.service";

interface AgoraTokenResponse {
  success: boolean;
  token: string;
  channel: string;
  uid: string;
}

/**
 * Fetch Agora RTC token from backend
 * @param eventId - The event/channel ID
 * @returns Token, channel name, and UID
 */
export const fetchAgoraToken = async (
  eventId: string
): Promise<AgoraTokenResponse> => {
  try {
    const { data } = await api.get<AgoraTokenResponse>(
      `/sessions/${eventId}/token`
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch Agora token:", error);
    throw new Error("Unable to get video session token");
  }
};

/**
 * Generate a random UID for Agora
 * Only use this if backend doesn't assign UIDs
 */
export const generateUID = (): number => {
  return Math.floor(Math.random() * 100000);
};
