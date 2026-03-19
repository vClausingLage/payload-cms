import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  // Extract tenant slug and locale from the request user's tenant context if available
  // Falls back to the first locale defined in the Payload config
  const locale = (req.locale as string) || 'en'
  const tenantSlug =
    req.user && typeof req.user === 'object' && 'tenant' in req.user
      ? (req.user as { tenant?: { slug?: string } }).tenant?.slug
      : undefined

  const basePath = tenantSlug
    ? `/${tenantSlug}/${locale}${collectionPrefixMap[collection]}/${encodedSlug}`
    : `${collectionPrefixMap[collection]}/${encodedSlug}`

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: basePath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
