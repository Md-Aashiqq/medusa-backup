import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import note from './src/modules/note'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  modules: {
    banner: {
      resolve: "./src/modules/banner",
    },
    note: {
      resolve: "./src/modules/note",
    }
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    vite: () => {
      return {
        server: {
          allowedHosts: [".mdaashiq.in"],
        },
      }
    },
  }
})
