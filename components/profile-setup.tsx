"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProfileSetupProps {
  onComplete: (username: string, avatar: string) => void
  initialUsername?: string
  initialAvatar?: string
}

const avatarOptions = ["🐱", "🐶", "🦊", "🐼", "🐨", "🦁", "🐯", "🐸", "🐧", "🦉", "🦄", "🐲"]

export function ProfileSetup({ onComplete, initialUsername = "", initialAvatar = "🐱" }: ProfileSetupProps) {
  const [username, setUsername] = useState(initialUsername)
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onComplete(username.trim(), selectedAvatar)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to SuperType!</CardTitle>
          <CardDescription>Let's set up your typing profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                maxLength={20}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Choose your avatar</Label>
              <div className="flex justify-center mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-2xl">{selectedAvatar}</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      selectedAvatar === avatar
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xl">{avatar}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!username.trim()}>
              Start Typing Journey
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
