import { NextRequest, NextResponse } from "next/server";

const LOGIN_PATH = "/login";
const ROOT_PATH = "/";
const FOODS_PATH = "/foods";
const SUGGESTION_PATH = "/suggestion";
const TOKEN_COOKIE = "admin_token";

function isProtectedPath(pathname: string) {
  if (pathname === ROOT_PATH) {
    return true;
  }

  return pathname.startsWith(FOODS_PATH) || pathname.startsWith(SUGGESTION_PATH);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  if (isProtectedPath(pathname) && !hasToken) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (pathname === LOGIN_PATH && hasToken) {
    return NextResponse.redirect(new URL(FOODS_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/foods/:path*", "/suggestion/:path*"],
};
