import { model } from "@medusajs/framework/utils"

const Note = model.define("note", {
  id: model.id().primaryKey(),
  content: model.text(), // This will store your text from the frontend
})

export default Note