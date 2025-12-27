import JournalController from "@/controller/journal"
import Database from "@/database"
import { authenticateRoute } from "@/lib/auth-route"
import { JournalInsertSchema } from "@/types/journal"
import { NextResponse } from "next/server"

export const GET = async () => {
  await authenticateRoute()
  await Database.connect()
  const journal = await JournalController.getTodaysJournal()
  if(!journal) return NextResponse.json({data: {content: ""}});
  return NextResponse.json({data: journal})
}


export const POST = async (req: Request) => {
  await authenticateRoute()
  const body = await req.json()
  const journalData = JournalInsertSchema.parse(body)
  await Database.connect()
  const journal = await JournalController.addJournal(journalData)
  return NextResponse.json({data: journal})
}