import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/access'
import { formatSlugHook } from '@/hooks/formatSlug'
import {
  HeroBlock,
  RichContentBlock,
  ServiceCardsBlock,
  CTABlock,
  AccordionBlock,
  StatsBlock,
  ContactFormBlock,
  ImageTextBlock,
  ClientLogosBlock,
  VideoBlock,
  DownloadBlock,
} from '@/blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlugHook],
      },
    },
    {
      name: 'heroType',
      type: 'select',
      defaultValue: 'fullscreen',
      options: [
        { label: 'Fullscreen', value: 'fullscreen' },
        { label: 'Small', value: 'small' },
        { label: 'None', value: 'none' },
      ],
    },
    {
      name: 'heroTitle',
      type: 'richText',
    },
    {
      name: 'heroSubtitle',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroCTALabel',
      type: 'text',
    },
    {
      name: 'heroCTALink',
      type: 'text',
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock,
        RichContentBlock,
        ServiceCardsBlock,
        CTABlock,
        AccordionBlock,
        StatsBlock,
        ContactFormBlock,
        ImageTextBlock,
        ClientLogosBlock,
        VideoBlock,
        DownloadBlock,
      ],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
    },
    {
      name: 'showContactForm',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      type: 'group',
      name: 'meta',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
