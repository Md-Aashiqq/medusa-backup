// src/modules/banner/index.ts
import { Banner } from "./models/banner"
import BannerModuleService from "./service"

export default {
  service: BannerModuleService,
  models: {
    Banner,
  },
  linkable: {
    banner: Banner,
  },
}
