import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doc = searchParams.get("doc") ?? "sample-spec.pdf";
  // Mock: redirect to public file or return 204 for POC
  const url = `/docs/${doc}`;
  return NextResponse.redirect(new URL(url, req.url), 302);
}
