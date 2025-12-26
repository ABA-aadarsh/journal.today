import { AUTH_TOKEN_KEY, signToken, validateLogin } from "@/lib/auth"
import { NextResponse } from "next/server"
import z from "zod"

const LoginBodySchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty()
})
export const POST = async (req: Request) => {
  const body = await req.json()
  const loginData = LoginBodySchema.parse(body)
  if(validateLogin(loginData.username, loginData.password)){
    const token = signToken()
    const response = NextResponse.json({message : "Login Successfull"})
    response.cookies.set({
      name: AUTH_TOKEN_KEY,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }
}