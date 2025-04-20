// src/api/middlewares.ts
import { defineMiddlewares } from "@medusajs/framework/http"
import multer from "multer"

const upload = multer({ 
  storage: multer.memoryStorage()
})

export default defineMiddlewares({

  routes: [
    {
      method: ["POST"],
      matcher: "/admin/banners",
      middlewares: [
        // @ts-ignore
        upload.array("files"), // Explicitly limit to 3 files
      ],
    },
  ],
})
