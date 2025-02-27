import { getToken } from "@/utils/auth";
import { NextResponse} from "next/server";

export async function GET() {
  const token = await getToken();

  return NextResponse.json(token);
}
