import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'de']
const defaultLocale = 'en'

// Paths that should not be processed by locale middleware
const skipPrefixes = ['admin', 'api', 'next', '_next', 'sitemap', 'robots.txt', 'favicon']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const parts = pathname.split('/').filter(Boolean)

  // Skip internal/admin/api paths
  if (parts.length > 0 && skipPrefixes.some((prefix) => parts[0] === prefix)) {
    return NextResponse.next()
  }

  // Root path — no tenant to redirect to
  if (parts.length === 0) return NextResponse.next()

  // If there is a tenant segment but no valid locale at position [1], add the default locale
  const hasValidLocale = parts.length >= 2 && locales.includes(parts[1])

  if (!hasValidLocale) {
    const url = request.nextUrl.clone()
    const tenant = parts[0]
    const rest = parts.slice(1).join('/')
    url.pathname = `/${tenant}/${defaultLocale}${rest ? `/${rest}` : ''}`
    // 308 preserves the HTTP method, good for permanent redirects
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)',
  ],
}
