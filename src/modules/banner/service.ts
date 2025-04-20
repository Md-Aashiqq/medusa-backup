// src/modules/banner/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { Banner } from "./models/banner"

class BannerModuleService extends MedusaService({
  Banner,
}) {
  // You can add custom methods here if needed
}

export default BannerModuleService
