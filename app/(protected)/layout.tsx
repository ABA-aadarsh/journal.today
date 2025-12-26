import { authenticateUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import React from "react"

interface props {
  children?: React.ReactNode
}
export const ProtectedLayout = async ({children}: props) => {
  const authenticated = await authenticateUser()
  if(!authenticated) return notFound();
  return (
    <>
      {children}
    </>
  )
}