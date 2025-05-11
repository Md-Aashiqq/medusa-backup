// src/api/note/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// POST: Create a new note
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // You would typically resolve your NoteModuleService here and create a note
  // Example:
  // const noteModuleService = req.scope.resolve("noteModuleService")
  // const note = await noteModuleService.createNotes({ content: req.body.content })
  // res.json({ note })

  res.json({ message: "[POST] Note created!" }) // Placeholder
}

// GET: Retrieve notes
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // You would typically resolve your NoteModuleService here and fetch notes
  // Example:
  // const noteModuleService = req.scope.resolve("noteModuleService")
  // const notes = await noteModuleService.listNotes()
  // res.json({ notes })

  res.json({ message: "[GET] Notes fetched!" }) // Placeholder
}