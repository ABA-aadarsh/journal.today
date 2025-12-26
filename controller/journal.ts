import { getTodayDate } from "@/lib/date"
import JournalModel from "@/database/models"
import { Journal } from "@/types/journal"

const addJournal = async (data: Omit<Journal, "_id" | "date">) => {
  if(!data.content) {
    throw new Error("Content is empty can't save that")
  }
  const currentDate = getTodayDate()
  const existing = await JournalModel.findOne({date: currentDate})
  if(!existing){
    // create new journal for today
    const newJournal = new JournalModel({
      content: data.content,
    })
    const savedJournal = await newJournal.save()
    return savedJournal
  }else {
    // allow to update today's journal
    return await JournalModel.findOneAndUpdate({date: currentDate}, {content: data.content}, {returnDocument: "after"})
  }
}

const getTodaysJournal = async () => {
  return await JournalModel.findOne({date: getTodayDate()}) as Journal | null
}

const JournalController = {
  getTodaysJournal,
  addJournal
}

export default JournalController