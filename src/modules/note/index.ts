// src/modules/note/index.ts

import { Module } from "@medusajs/framework/utils"
import NoteModuleService from "./service"

export const NOTE_MODULE = "note"
export default Module(NOTE_MODULE, { service: NoteModuleService })