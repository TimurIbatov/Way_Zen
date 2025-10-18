"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  interests: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateInterests: (interests: string[]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const existingUser = localStorage.getItem(`user_${email}`)

    if (existingUser) {
      const userData = JSON.parse(existingUser)
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } else {
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        interests: [],
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      interests: [],
    }
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateInterests = (interests: string[]) => {
    if (user) {
      const updatedUser = { ...user, interests }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateInterests }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
