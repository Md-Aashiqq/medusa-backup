import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createNoteWorkflow } from "../../../workflows/create-note"

type NoteRequestBody = { content: string }

export const POST = async (
  req: MedusaRequest<NoteRequestBody>,
  res: MedusaResponse
) => {
  const { result } = await createNoteWorkflow(req.scope).run({
    input: result.validatedBody,
  })
  return res.json(result)
}