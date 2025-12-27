import { getTodayDate } from "@/lib/date"
import JournalModel from "@/database/models"
import { Journal } from "@/types/journal"

const addJournal = async (data: Omit<Journal, "_id" | "date" | "streakAtDate">) => {
  const currentDate = getTodayDate();
  const existing = await JournalModel.findOne({ date: currentDate });

  if (existing) {
    // Just update content, streak stays the same
    return await JournalModel.findOneAndUpdate(
      { date: currentDate },
      { content: data.content },
      { returnDocument: "after" }
    );
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const yesterdayEntry = await JournalModel.findOne({ date: yesterdayStr });
  const newStreak = yesterdayEntry ? (yesterdayEntry.streakAtDate || 0) + 1 : 1;

  const newJournal = new JournalModel({
    content: data.content,
    date: currentDate,
    streakAtDate: newStreak
  });

  return await newJournal.save();
};

const getTodaysJournal = async () => {
  return await JournalModel.findOne({ date: getTodayDate() }) as Journal | null
}

const getStreak = async (): Promise<number> => {
  const latestEntry = await JournalModel.findOne().sort({ date: -1 });
  if (!latestEntry) {
    return 0;
  }
  const todayStr = getTodayDate();
  if (latestEntry.date === todayStr) {
    return latestEntry.streakAtDate || 0;
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (latestEntry.date === yesterdayStr) {
    return latestEntry.streakAtDate || 0;
  }
  return 0;
};

const JournalController = {
  getTodaysJournal,
  addJournal,
  getStreak
}

export default JournalController