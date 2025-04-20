// // src/api/admin/banners/route.ts
// import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
// import { Modules } from "@medusajs/framework/utils"

// export async function GET(
//   req: MedusaRequest,
//   res: MedusaResponse
// ) {
//   const fileModuleService = req.scope.resolve(Modules.FILE)
  
//   try {
//     // You would typically store references to your banner images in a database
//     // For this example, we'll assume you have a naming convention for banners

//     const listFiles = fileModuleService.listFiles({
       
//     })

//     console.log("List of files:", listFiles)    

//     const bannerFiles = await Promise.all([
//       fileModuleService.retrieveFile("banner1.jpg").catch(() => null),
//       fileModuleService.retrieveFile("banner2.jpg").catch(() => null),
//       fileModuleService.retrieveFile("banner3.jpg").catch(() => null),
//     ])
    
//     const banners = bannerFiles
//       .filter(banner => banner !== null)
//       .map(banner => ({
//         url: banner.url,
//         id: banner.id
//       }))

//     console.log("Banners retrieved:", banners)
    

//     console.log("Number of banners retrieved:", banners.length)

//     res.status(200).json({ banners })
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error retrieving banner images",
//       error: error.message 
//     })
//   }
// }


// src/api/admin/banners/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { uploadBannerWorkflow } from "../../../workflows/upload-banner"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const bannerService = req.scope.resolve("banner")
  
  try {
    const banners = await bannerService.listBanners({}, {
        order: { rank: "ASC" }
      })
    
    console.log("Banners retrieved:", banners)
    

    console.log("Number of banners retrieved:", banners.length)
  
    
    res.status(200).json({ banners })
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving banner images",
      error: error.message 
    })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const files = req.files as Express.Multer.File[]
  const { ranks } = req.body

  console.log("Files received:", req.files)
console.log("Number of files received:", req.files?.length)
  console.log("Ranks received:", ranks)

  if (!files?.length) {
    return res.status(400).json({ message: "No files were uploaded" })
  }
  
  try {
    const { banners } = await uploadBannerWorkflow(req.scope).run({
      input: {
        files,
        ranks: ranks ? JSON.parse(ranks) : [],
      },
    })
    
    res.status(200).json({ banners })
  } catch (error) {
    console.error("Error uploading banners:", error)
    res.status(500).json({ 
      message: "Error uploading banner images",
      error: error.message 
    })
  }
}
