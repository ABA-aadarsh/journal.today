import jwt from "jsonwebtoken";
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


if(!process.env.USER || !process.env.PASSWORD || !process.env.JWT_SECRET){
  throw new Error("Environment variables: USER, PASSWORD and JWT_SECRET not set")
}

const JWT_SECRET = process.env.JWT_SECRET!;
export const AUTH_TOKEN_KEY = "auth-token"
const JWT_EXPIRES_IN = "7d";


export type JwtPayload = {
  userid: number;
  USER: string;
  message: string;
  motto: string;
};

export function signToken(): string {
  const payload: JwtPayload = {
    userid: 1,
    USER: process.env.USER!,
    message: "It is a good day to journal",
    motto: "Be grateful"
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}


export const validateLogin = (USER: string, password: string) => {
  console.log({USER, password})
  console.log(process.env.USER, process.env.PASSWORD)
  return (USER == process.env.USER && password == process.env.PASSWORD)
}


export const authenticateUser = async () => {
  const token = (await cookies()).get(AUTH_TOKEN_KEY)?.value
  if(!token) return false;
  const payload = verifyToken(token)
  if(!payload) return false;
  return true;
}




