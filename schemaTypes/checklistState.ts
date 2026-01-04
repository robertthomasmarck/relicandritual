import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'checklistState',
  title: 'Checklist State',
  type: 'document',
  fields: [
    defineField({
      name: 'identifier',
      title: 'Checklist Identifier',
      type: 'string',
      description: 'Unique identifier for this checklist (e.g., "year-of-bones")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Checkbox States',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'checkboxItem',
          fields: [
            defineField({
              name: 'id',
              type: 'string',
              title: 'Checkbox ID',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'checked',
              type: 'boolean',
              title: 'Checked',
              initialValue: false,
            }),
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label (for reference)',
              description: 'Human-readable label for debugging',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'identifier',
      items: 'items',
    },
    prepare({ title, items }) {
      const checked = items?.filter((i: { checked: boolean }) => i.checked).length || 0
      const total = items?.length || 0
      return {
        title: title || 'Checklist',
        subtitle: `${checked}/${total} completed`,
      }
    },
  },
})
