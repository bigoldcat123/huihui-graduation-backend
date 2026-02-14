import { NextRequest, NextResponse } from "next/server";

const LOGIN_PATH = "/login";
const DASHBOARD_PATH = "/";
const TOKEN_COOKIE = "admin_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  if (pathname === DASHBOARD_PATH && !hasToken) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (pathname === LOGIN_PATH && hasToken) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
