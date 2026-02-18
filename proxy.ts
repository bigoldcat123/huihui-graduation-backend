import { NextRequest, NextResponse } from "next/server";

const LOGIN_PATH = "/login";
const ROOT_PATH = "/";
const FOODS_PATH = "/foods";
const SUGGESTION_PATH = "/suggestion";
const TOKEN_COOKIE = "admin_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  if ((pathname === ROOT_PATH || pathname === FOODS_PATH || pathname === SUGGESTION_PATH) && !hasToken) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  if (pathname === LOGIN_PATH && hasToken) {
    return NextResponse.redirect(new URL(FOODS_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/foods", "/suggestion"],
};
