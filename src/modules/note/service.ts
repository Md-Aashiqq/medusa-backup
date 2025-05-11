import { MedusaService } from "@medusajs/framework/utils"
import Note from "./models/note"

class NoteModuleService extends MedusaService({ Note }) {}

export default NoteModuleService