import { NextResponse, NextRequest } from "next/server";
 
let locales = ['en', 'de'];
 
 
export function proxy(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next()
  }
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Skip internal/admin/api paths
  const parts = pathname.split('/').filter(Boolean)
  const skipPrefixes = ['_next', 'admin', 'api']
  if (parts.length > 0 && skipPrefixes.some((prefix) => parts[0] === prefix)) {
    return NextResponse.next()
  }
 
  if (pathnameHasLocale) return NextResponse.next()
 
  // Redirect if there is no locale
  const locale = 'de'
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip internal paths and common static assets
    '/((?!api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}