import { NextResponse  } from "next/server";
import { listObjects, urnify } from "@/utils/oss";
export  const revalidate = 0
export async function GET() {
  const objects: { objectKey: string; objectId: string }[] =
    await listObjects();
  const urn = urnify(objects[0].objectId);
  return NextResponse.json({urn});
}