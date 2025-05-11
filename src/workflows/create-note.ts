import { createStep, StepResponse, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import NoteModuleService from "../modules/note/service"

const createNoteStep = createStep(
  "create-note",
  async ({ content }: { content: string }, { container }) => {
    const noteModuleService: NoteModuleService = container.resolve("noteModuleService")
    const note = await noteModuleService.createNotes({ content })
    return new StepResponse(note, note.id)
  },
  async (noteId, { container }) => {
    if (!noteId) return
    const noteModuleService: NoteModuleService = container.resolve("noteModuleService")
    await noteModuleService.deleteNotes(noteId)
  }
)

export const createNoteWorkflow = createWorkflow(
  "create-note-workflow",
  function (input: { content: string }) {
    const note = createNoteStep({ content: input.content })
    return new WorkflowResponse(note)
  }
)