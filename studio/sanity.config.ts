import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Relic & Ritual',

  projectId: 'bvrczugu',
  dataset: 'relicnritual',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
