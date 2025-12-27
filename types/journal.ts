import z from "zod";

export const JournalInsertSchema = z.object({
  content: z.string().nonempty()
})

export interface Journal {
  _id: string;
  content: string ;
  date: string
  streakAtDate: number
}