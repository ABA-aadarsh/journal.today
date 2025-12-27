"use client"

import { Circle, CircleDot, Pen } from "lucide-react"
import Image from "next/image"

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center w-dvw h-dvh">
      <Image
        src={"/logo.svg"}
        alt="Logo"
        width={400}
        height={200}
      />

      <div className="bg-slate-100 py-3 px-4 rounded-lg fixed top-4 right-4 border">
        <div className="flex items-center gap-2 ">
          <CircleDot size={10}/>
          <span className="font-medium text-lg">
            Thoughts should be monitored
          </span>
        </div>
      </div>
    </div>
  )
}
export default LandingPage