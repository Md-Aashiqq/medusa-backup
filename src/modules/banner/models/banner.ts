// src/modules/banner/models/banner.ts
import { model } from "@medusajs/framework/utils"

export const Banner = model.define("banner", {
  id: model.id().primaryKey(),
  file_id: model.text(), // Reference to the file in the File Module
  url: model.text(),     // Store the URL for quick access
  name: model.text(),    // Original filename
  rank: model.number().default(0), // For ordering banners
})
