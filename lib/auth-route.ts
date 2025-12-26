import { NextResponse } from "next/server"
import { authenticateUser } from "./auth"

export const authenticateRoute = async () => {
  if(!await authenticateUser()){
    return NextResponse.json({message: "Forbidden"}, {status: 403})
  }
}