import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const bannerService = req.scope.resolve("banner")
  
  try {
    const banners = await bannerService.listBanners({}, {
      order: { rank: "ASC" },
    })
    
    res.status(200).json({ banners })
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving banner images",
      error: error.message 
    })
  }
}
