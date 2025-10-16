import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {ptBRLocale} from '@sanity/locale-pt-br'
// import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'mix-norte',

  projectId: 'psodomd7',
  dataset: 'production',

  plugins: [structureTool(), ptBRLocale()],

  schema: {
    types: schemaTypes,
  },
})
