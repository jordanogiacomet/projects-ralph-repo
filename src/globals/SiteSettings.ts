import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'WhatsApp Number',
    },
    {
      name: 'whatsappMessage',
      type: 'textarea',
      label: 'WhatsApp Default Message',
    },
    {
      name: 'cookieConsentText',
      type: 'textarea',
      label: 'Cookie Consent Text',
    },
    {
      type: 'group',
      name: 'defaultMeta',
      label: 'Default SEO Meta',
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
    {
      name: 'analyticsId',
      type: 'text',
      label: 'Google Analytics ID',
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      defaultValue: false,
      label: 'Maintenance Mode',
    },
  ],
}
