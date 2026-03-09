import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Solucoes } from './collections/Solucoes'
import { SolucaoCategories } from './collections/SolucaoCategories'
import { Clientes } from './collections/Clientes'
import { ClienteSegmentos } from './collections/ClienteSegmentos'
import { Conteudos } from './collections/Conteudos'
import { FormSubmissions } from './collections/FormSubmissions'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'

import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Posts,
    Solucoes,
    SolucaoCategories,
    Clientes,
    ClienteSegmentos,
    Conteudos,
    FormSubmissions,
    NewsletterSubscribers,
  ],
  globals: [Header, Footer, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp: (await import('sharp')).default,
})
