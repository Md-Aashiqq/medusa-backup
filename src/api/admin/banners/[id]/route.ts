import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { deleteBannerWorkflow } from "../../../../workflows/delete-banner"

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  
  if (!id) {
    return res.status(400).json({ message: "Banner ID is required" })
  }
  
  try {
    const result = await deleteBannerWorkflow(req.scope).run({
      input: { id },
    })
    
    res.status(200).json(result)
  } catch (error) {
    console.error("Error deleting banner:", error)
    res.status(500).json({ 
      message: "Error deleting banner image",
      error: error.message 
    })
  }
}

