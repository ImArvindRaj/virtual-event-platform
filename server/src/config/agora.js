import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;

export const generateRtcToken = (channelName, uid, role = 'publisher', expirationTimeInSeconds = 3600) => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId) {
    throw new Error('AGORA_APP_ID is not defined in environment variables');
  }

  if (!appCertificate) {
    throw new Error('AGORA_APP_CERTIFICATE is not defined in environment variables');
  }

  // Calculate privilege expiration timestamp (Unix time in seconds)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Map role string to RtcRole constant
  const roleType = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  // Use buildTokenWithAccount for string UIDs (like MongoDB ObjectIds)
  const token = RtcTokenBuilder.buildTokenWithAccount(
    appId,
    appCertificate,
    channelName,
    uid, // Pass the string UID directly using Account method
    roleType,
    privilegeExpiredTs
  );

  return token;
};
