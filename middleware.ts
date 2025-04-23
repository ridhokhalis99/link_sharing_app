import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For simplicity, we'll use a cookie to determine if the user is authenticated
  const isAuthenticated = request.cookies.has("auth_token");
  const url = request.nextUrl.clone();

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and trying to access login/signup
  if (isAuthenticated && isPublicRoute) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Match all routes except public assets, api routes, etc.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
