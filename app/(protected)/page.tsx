"use client"
import TinyMCEEditorComponent from "@/components/TinyMCEEditor"
import { Button } from "@/components/ui/button"
import { getTodayDate } from "@/lib/date"
import { Calendar, Flame } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"

const HomePage = () => {
  const [content, setContent] = useState<string>("")
  const [editorHeight, setEditorHeight] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  // --- New State for Streak ---
  const [streak, setStreak] = useState<number>(0)

  useEffect(() => {
    const windowHeight = window.innerHeight
    setEditorHeight(windowHeight - 50)
  }, [])

  // Fetch Journal and Streak
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [journalRes, streakRes] = await Promise.allSettled([
          axios.get("/api/journal"),
          axios.get("/api/journal/streak")
        ])

        if (journalRes.status === "fulfilled" && journalRes.value.data.data) {
          setContent(journalRes.value.data.data.content || "")
        }
        if (streakRes.status === "fulfilled") {
          setStreak(streakRes.value.data.streak || 0)
        }
      } catch (error) {
        console.error("Error loading data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = useCallback(async () => {
    if (!content.trim()) {
      toast.error("Journal is empty", {
        description: "Please write something before saving"
      })
      return
    }

    setIsSaving(true)
    try {
      await axios.post("/api/journal", {
        content,
      })
      const streakRes = await axios.get("/api/journal/streak")
      setStreak(streakRes.data.streak)

      toast.success("Saved", {
        description: "Your journal has been saved"
      })
    } catch (error) {
      toast.error("Failed to save", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || "Could not save journal"
          : "An error occurred"
      })
    } finally {
      setIsSaving(false)
    }
  }, [content])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  return (
    <div className="h-dvh w-dvw flex flex-col gap-0 overflow-hidden">
      <div className="flex items-center justify-between shrink-0 h-[50px] px-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-4">
          <Image
            src={"/logo.svg"}
            alt="Logo"
            width={20}
            height={20}
          />

          {/* --- Streak Display --- */}
          {!isLoading && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/30 rounded-full border border-orange-100 dark:border-orange-900/50">
              <Flame size={16} className="text-orange-500 fill-orange-500" />
              <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                {streak}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="font-sans hidden sm:flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
            <Calendar size={12} />
            <span>
              {getTodayDate().replaceAll("-", " ")}
            </span>
          </div>

          <Button
            variant={"link"}
            className="cursor-pointer font-bold"
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      {
        editorHeight && !isLoading &&
        <div className="">
          <TinyMCEEditorComponent
            value={content}
            onChange={setContent}
            height={editorHeight}
          />
        </div>
      }
      {
        isLoading &&
        <div className="flex-1 flex items-center justify-center text-stone-500 dark:text-stone-400">
          Loading...
        </div>
      }
    </div>
  )
}

export default HomePage