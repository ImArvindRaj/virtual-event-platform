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

  // Convert uid to number if it's a string
  const numericUid = typeof uid === 'string' ? parseInt(uid, 10) : uid;
  
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  
  const roleType = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    numericUid,
    roleType,
    privilegeExpiredTs
  );
  
  return token;
};
