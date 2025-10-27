import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Categorias',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      title: 'Nome',
      name: 'title',
      type: 'string',
      validation: (value) => value.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      title: 'Descrição',
      name: 'description',
      type: 'text',
    }),
    defineField({
      title: 'Ordem',
      name: 'order',
      type: 'number',
    }),
  ],
})
