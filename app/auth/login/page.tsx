"use client"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"


const LoginPage = () => {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogin = useCallback(async (username: string, password: string) => {
    if (!username || !password) {
      toast.info("Username and Password are both required")
      return null;
    }

    setIsLoading(true)

    try {
      await axios.post("/api/auth/login", {
        username,
        password
      })

      toast.success("Welcome")
      router.push("/")
    } catch (error) {
      toast.error("Login failed", { description: (error as  {message: string} | null)?.message || "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }, [router, toast])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(username, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl text-stone-800 dark:text-stone-200">
            Journal
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Welcome back
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-stone-800 hover:bg-stone-700 dark:bg-stone-200 dark:hover:bg-stone-300 dark:text-stone-900 text-white"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage