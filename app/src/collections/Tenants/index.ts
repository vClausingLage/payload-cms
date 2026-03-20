import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { de } from '@payloadcms/translations/languages/de'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  labels: {
    singular: {
      de: 'Mandant',
      en: 'Tenant',
    },
    plural: {
      de: 'Mandanten',
      en: 'Tenants',
    },
  },
  admin: {
    defaultColumns: ['name', 'domain'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name:'domain',
      type: 'text',
      required: true,
      unique: true,
    }
  ],
  timestamps: true,
}