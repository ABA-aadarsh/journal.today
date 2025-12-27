import JournalController from "@/controller/journal";
import { authenticateRoute } from "@/lib/auth-route";
import { NextResponse } from "next/server";
// export const revalidate = 3600;

export async function GET() {
  await authenticateRoute()
  try {
    const streak = await JournalController.getStreak();
    return NextResponse.json(
      { streak }
    );
  } catch (error) {
    console.error("Streak API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch streak" },
      { status: 500 }
    );
  }
}