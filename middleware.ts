import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware to protect admin routes and handle authentication
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin, dashboard and sensitive API routes
  const isProtectedRoute = pathname.startsWith("/admin") || 
                           pathname.startsWith("/dashboard") ||
                           pathname.startsWith("/api/v1/sync") ||
                           pathname.startsWith("/api/v1/admin");

  if (isProtectedRoute) {
    const authCookie = request.cookies.get("sdi-admin-session");
    
    if (!authCookie) {
      console.log(`[Middleware] Unauthorized access attempt to: ${pathname}, redirecting to /login`);
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Config to only run middleware on specific paths
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/v1/sync/:path*",
    "/api/v1/admin/:path*",
  ],
};
