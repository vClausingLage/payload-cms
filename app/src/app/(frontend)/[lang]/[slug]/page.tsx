import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

const locales = ['de', 'en'] as const

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const payloadWithLocale = payload as any
  const docsByLocale = await Promise.all(
    locales.map(async (lang) => {
      const pages = await payloadWithLocale.find({
        collection: 'pages',
        draft: false,
        limit: 1000,
        locale: lang,
        overrideAccess: false,
        pagination: false,
        select: {
          slug: true,
        },
      })

      return pages.docs
        ?.filter((doc: { slug?: string | null }) => {
          return Boolean(doc.slug) && doc.slug !== 'home'
        })
        .map(({ slug }: { slug?: string | null }) => ({ slug: slug as string, lang }))
    }),
  )

  return docsByLocale.flat().filter(Boolean)
}

type Args = {
  params: Promise<{
    slug?: string
    lang?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', lang = 'de' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
    lang
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home', lang = 'de' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
    lang
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, lang }: { slug: string, lang: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })
  const payloadWithLocale = payload as any

  const result = await payloadWithLocale.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale: lang,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
