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
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
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