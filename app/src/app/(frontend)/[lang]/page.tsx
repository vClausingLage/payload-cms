import type { Metadata } from 'next'

import PageTemplate, { generateMetadata as generateSlugMetadata } from './[slug]/page'

type Args = {
  params: Promise<{
    lang?: string
  }>
}

export default async function LocalizedHomePage({ params: paramsPromise }: Args) {
  const { lang = 'de' } = await paramsPromise

  return <PageTemplate params={Promise.resolve({ lang, slug: 'home' })} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { lang = 'de' } = await paramsPromise

  return generateSlugMetadata({ params: Promise.resolve({ lang, slug: 'home' }) })
}

export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'en' }]
}
