import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LOCALE_COOKIE, matchLocale } from "lib/i18n";

// Next.js "proxy" (formerly middleware). Every page lives under `/[lang]`. A request without a locale prefix is
// redirected to one: the visitor's last choice (cookie) first, then their
// browser's Accept-Language, then the default locale.
//
// A request that already has a prefix passes through and refreshes the cookie,
// so switching language sticks the next time someone lands on `/`.

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const lang = isLocale(saved)
    ? saved
    : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals and any path with a file extension
  // (favicon.ico, icon.png, robots.txt, sitemap.xml, /images/…).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
