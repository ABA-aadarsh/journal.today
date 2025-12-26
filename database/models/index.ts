import mongoose, { SchemaTypes } from "mongoose";

import {getTodayDate} from "@/lib/date"
import { Journal } from "@/types/journal";

interface IJournalSchema extends mongoose.Document, Omit<Journal, "_id"> {}

const JournalSchema = new mongoose.Schema<IJournalSchema>({
  content: {
    type: SchemaTypes.String,
    default: null,
    required: true
  },
  date: {
    type: SchemaTypes.String,
    unique: true,
    default: getTodayDate,
    index: true
  }
})

const JournalModel : mongoose.Model<IJournalSchema> = mongoose.models.Journals || mongoose.model<IJournalSchema>("Journals", JournalSchema)

export default JournalModel