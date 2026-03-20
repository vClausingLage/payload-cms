import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
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