
import { 
    createWorkflow, 
    createStep, 
    StepResponse,
    WorkflowResponse 
  } from "@medusajs/framework/workflows-sdk"
  import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows"
  
  // Step 1: Create a step to retrieve the banner
  const retrieveBannerStep = createStep(
    "retrieve-banner-step",
    async ({ id }, { container }) => {
      const bannerService = container.resolve("banner")
      const banner = await bannerService.retrieveBanner(id)
      
      if (!banner) {
        throw new Error(`Banner with id ${id} not found`)
      }
      
      return new StepResponse(banner)
    }
  )
  
  // Step 2: Create a step to delete the banner record
  const deleteBannerStep = createStep(
    "delete-banner-step",
    async ({ id }, { container }) => {
      const bannerService = container.resolve("banner")
      await bannerService.deleteBanners(id)
      
      return new StepResponse({ id })
    }
  )
  
  // Create the workflow
  export const deleteBannerWorkflow = createWorkflow(
    "delete-banner",
    function (input) {
      // Step 1: Retrieve the banner
      const banner = retrieveBannerStep(input)
      
      // Step 2: Delete the file using the core workflow
      deleteFilesWorkflow(this.container).run({
        input: {
          ids: [banner.file_id]  // Note: 'ids' is the correct property name
        }
      })
      
      // Step 3: Delete the banner record
      const result = deleteBannerStep(input)
      
      return new WorkflowResponse({
        id: result.id,
        success: true
      })
    }
  )
