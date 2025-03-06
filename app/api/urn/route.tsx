import { NextResponse  } from "next/server";
import { listObjects, urnify } from "@/utils/oss";
export  const revalidate = 0
export async function GET() {
  const objects: { objectKey: string; objectId: string }[] =
    await listObjects();

  //console.log(objects);

  const urn = urnify(objects[1].objectId);
  return NextResponse.json({urn});
}