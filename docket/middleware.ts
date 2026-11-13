
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const NOINDEX_PATHS = [
  "/admin",
  "/auth",
  "/classes",
  "/dashboard",
  "/history",
  "/join",
  "/login",
  "/onboarding",
  "/settings",
];

function shouldNoIndex(pathname: string) {
  return NOINDEX_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // The cron endpoint uses its own CRON_SECRET authentication.
  if (pathname === "/api/cron/push-reminders") {
    return NextResponse.next();
  }

  const response = await updateSession(request);

  if (shouldNoIndex(pathname)) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/|sw.js|sitemap.xml|robots.txt).*)",
  ],
};

