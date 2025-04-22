import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = ['/login', '/signup'].includes(path);

  // Verifica TODOS os cookies possíveis do NextAuth
  const hasAuthCookie = [
    '__Secure-next-auth.session-token',
    'next-auth.session-token',
  ].some(cookie => request.cookies.has(cookie));

  // Debug: Mostra cookies no log (remova após resolver)
  console.log('Cookies encontrados:', 
    Object.keys(request.cookies)
  );

  if (!hasAuthCookie && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasAuthCookie && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)",
  ],
};
