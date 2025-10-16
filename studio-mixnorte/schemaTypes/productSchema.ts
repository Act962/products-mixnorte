import {IceCreamIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: IceCreamIcon,
  fields: [
    defineField({
      title: 'Nome',
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Descrição',
      name: 'description',
      type: 'text',
    }),
    defineField({
      title: 'Preço',
      name: 'price',
      type: 'number',
    }),
    defineField({
      title: 'Imagem',
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      title: 'Unidade',
      name: 'unit',
      type: 'string',
    }),
    defineField({
      title: 'Categoria',
      name: 'category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
})
