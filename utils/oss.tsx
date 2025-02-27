import { getToken, getInternalAuthClient } from "@/utils/auth";
import ForgeSDK from "forge-apis";

export const listObjects = async () => {
  let resp = await new ForgeSDK.ObjectsApi().getObjects(
    process.env.BUCKET_KEY!,
    { limit: 64 },
    getInternalAuthClient(),
    await getToken()
  );
  let objects = resp.body.items;

  while (resp.body.next) {
    resp = await new ForgeSDK.ObjectsApi().getObjects(
      process.env.BUCKET_KEY!,
      { limit: 64 },
      getInternalAuthClient(),
      await getToken()
    );
    objects = objects.concat(resp.body.items);
  }
  return objects;
};

export const urnify = (id: string) =>
  Buffer.from(id).toString("base64").replace(/=/g, "");
