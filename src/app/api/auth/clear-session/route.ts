import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const jar = cookies();
  jar.delete("sabeh-session");
  jar.delete("sabeh-auth-token");
  return NextResponse.redirect(new URL("/login", request.url));
}
