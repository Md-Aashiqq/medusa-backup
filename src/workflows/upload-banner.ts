// src/workflows/upload-banner.ts
import { 
    createWorkflow, 
    createStep, 
    WorkflowResponse 
  } from "@medusajs/framework/workflows-sdk"
  import { Modules } from "@medusajs/framework/utils"
  import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
  

  type UploadBannerInput = {
    files: any[],
    ranks?: number[]
  }
  

  // First, create a step to handle the file upload
  const uploadFilesStep = createStep(
    "upload-files-step",
    async (input, { container }) => {
      const { files, ranks = [] } = input
      
      // Upload files using the core workflow
      const { result: uploadedFiles } = await uploadFilesWorkflow(container).run({
        input: {
          files: files.map(file => ({
            filename: file.originalname,
            mimeType: file.mimetype,
            content:file.buffer,
            access: "public",
          })),
        },
      })
      
      // Store references in the banner module
      const bannerService = container.resolve("banner")
      
      console.log("Uploaded files:", uploadedFiles)
      console.log("Ranks being used for banners:", ranks)
      
      const banners = await Promise.all(
        uploadedFiles.map(async (file, index) => {
          return await bannerService.createBanners({
            file_id: file.id,
            url: file.url,
            name: file.originalname || file.filename || `Banner ${index + 1}`,
            rank: ranks[index] || index, // Use provided rank or default
          })
        })
      )
      
      console.log("Created banners:", banners)
      
      return {
        banners,
        files: uploadedFiles,
      }
    }
  )
  
  // Then create the workflow that uses the step
  export const uploadBannerWorkflow = createWorkflow(
    "upload-banner",
    function (input) {
      // Execute the step
      const result = uploadFilesStep(input)
      
      // Return the workflow response with the result
      return new WorkflowResponse({
        result
      })
    }
  )
