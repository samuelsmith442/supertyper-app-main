"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { TypingTest } from "@/components/typing-test"
import { CatMascot } from "@/components/cat-mascot"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Trophy } from "lucide-react"
import { getUserProfile, type UserProfile } from "@/lib/user-storage"

export default function PlayPage() {
  const [isTyping, setIsTyping] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [previousLevel, setPreviousLevel] = useState(0)

  const searchParams = useSearchParams()
  const router = useRouter()
  const level = Number.parseInt(searchParams.get("level") || "1")

  useEffect(() => {
    const profile = getUserProfile()
    setUserProfile(profile)
    setPreviousLevel(profile.level)
  }, [])

  const handleStateChange = (typing: boolean, completed: boolean) => {
    setIsTyping(typing)
    setHasCompleted(completed)
  }

  const handleTestComplete = () => {
    // Refresh user profile after test completion
    const updatedProfile = getUserProfile()

    // Check if user leveled up
    if (updatedProfile.level > previousLevel) {
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
    }

    setUserProfile(updatedProfile)
  }

  const getLevelTitle = (level: number) => {
    const titles = {
      1: "Basic Speed Test",
      2: "Common Phrases",
      3: "Punctuation Challenge",
      4: "Numbers & Symbols",
      5: "Code Snippets",
      6: "Speed Demon",
    }
    return titles[level as keyof typeof titles] || "Speed Test"
  }

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const levelProgress = (userProfile.currentLevelXP / userProfile.xpToNextLevel) * 100

  return (
    <div className="min-h-screen flex flex-col">
      {showLevelUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-8 text-center animate-bounce">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Level Up!</h2>
            <p className="text-muted-foreground">You reached Level {userProfile.level}!</p>
          </div>
        </div>
      )}

      <header className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href="/levels">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to levels</span>
              </Link>
            </Button>
            <h1 className="text-sm sm:text-xl md:text-2xl font-bold ml-2 sm:ml-4 truncate">
              <span className="hidden sm:inline">
                Level {level}: {getLevelTitle(level)}
              </span>
              <span className="sm:hidden">
                L{level}: {getLevelTitle(level).split(" ")[0]}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/profile">Profile</Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="sm:hidden">
              <Link href="/profile">
                <span className="text-lg">👤</span>
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-3xl space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Current Level: {level}</h2>
              <p className="text-sm text-muted-foreground">Complete the challenge to earn XP and unlock new levels</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-primary/10">
                  Level {userProfile.level}
                </Badge>
                <span className="text-sm text-muted-foreground">{userProfile.totalXP} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <Progress value={levelProgress} className="w-24 h-2" />
                <span className="text-xs text-muted-foreground">{userProfile.xpToNextLevel} XP to next</span>
              </div>
            </div>
          </div>

          <TypingTest onStateChange={handleStateChange} level={level} onTestComplete={handleTestComplete} />

          <div className="flex justify-center">
            <CatMascot isTyping={isTyping} hasCompleted={hasCompleted} />
          </div>
        </div>
      </main>
    </div>
  )
}
