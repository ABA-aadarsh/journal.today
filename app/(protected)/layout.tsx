import { authenticateUser } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import React from "react"

interface props {
  children?: React.ReactNode
}
const ProtectedLayout = async ({children}: props) => {
  const authenticated = await authenticateUser()
  if(!authenticated){
    return redirect("/landing")
  }
  return (
    <>
      {children}
    </>
  )
}
export default ProtectedLayout