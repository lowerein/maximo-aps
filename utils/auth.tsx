import ForgeSDK, { AuthToken } from "forge-apis";

let internalAuthClient = new ForgeSDK.AuthClientTwoLeggedV2(
  process.env.API_CLIENT_ID!,
  process.env.API_CLIENT_SECRET!,
  ["bucket:read", "bucket:create", "data:read", "data:write", "data:create"],
  true
);

let publicAuthClient = new ForgeSDK.AuthClientTwoLeggedV2(
  process.env.API_CLIENT_ID!,
  process.env.API_SECRET!,
  ["bucket:read", "data:read"],
  true
);

export const getInternalAuthClient = () => internalAuthClient;
export const getPublicAuthClient = () => publicAuthClient;

export const getToken = async () => {
  const token = await internalAuthClient.authenticate().then(() => {
    return internalAuthClient.getCredentials();
  });

  return token;
};

/*
export const refreshToken = async (refresh_token: string) => {
    const internalCredentials = await internalAuthClient.({
      refresh_token,
    });
    const publicCredentials = await publicAuthClient.refreshToken(
      internalCredentials
    );
    const expires_at = Date.now() + internalCredentials.expires_in * 1000;
  
    return {
      public_token: publicCredentials.access_token,
      internal_token: internalCredentials.access_token,
      refresh_token,
      expires_at,
    };
  };
  */
