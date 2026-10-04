import { defineType, defineField } from 'sanity'

export const siteImage = defineType({
  name: 'siteImage',
  title: 'Site Image',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A descriptive title for this image (e.g. "Hero Background")',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for screen readers',
    })
  ]
})
