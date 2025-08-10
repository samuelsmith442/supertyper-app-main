"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Lock, Trophy, Clock, Star, Zap, Target, Flame } from "lucide-react"
import { getUserProfile, resetUserProfile, type UserProfile } from "@/lib/user-storage"

const levels = [
  {
    id: 1,
    title: "Level 1",
    subtitle: "Basic Speed Test",
    difficulty: "Beginner",
    duration: "30 seconds",
    xp: 50,
    description: "Simple words",
    icon: Star,
    color: "text-green-500",
  },
  {
    id: 2,
    title: "Level 2",
    subtitle: "Common Phrases",
    difficulty: "Beginner",
    duration: "45 seconds",
    xp: 100,
    description: "Common phrases",
    icon: Target,
    color: "text-blue-500",
  },
  {
    id: 3,
    title: "Level 3",
    subtitle: "Punctuation Challenge",
    difficulty: "Intermediate",
    duration: "60 seconds",
    xp: 150,
    description: "Includes punctuation",
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    id: 4,
    title: "Level 4",
    subtitle: "Numbers & Symbols",
    difficulty: "Intermediate",
    duration: "60 seconds",
    xp: 200,
    description: "Numbers and symbols",
    icon: Trophy,
    color: "text-purple-500",
  },
  {
    id: 5,
    title: "Level 5",
    subtitle: "Code Snippets",
    difficulty: "Advanced",
    duration: "90 seconds",
    xp: 300,
    description: "Programming code",
    icon: Flame,
    color: "text-red-500",
  },
  {
    id: 6,
    title: "Level 6",
    subtitle: "Speed Demon",
    difficulty: "Expert",
    duration: "120 seconds",
    xp: 500,
    description: "Ultimate challenge",
    icon: Flame,
    color: "text-orange-500",
  },
]

export default function LevelsPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const profile = getUserProfile()
    setUserProfile(profile)
  }, [])

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to home</span>
              </Link>
            </Button>
            <h1 className="text-lg sm:text-2xl font-bold ml-2 sm:ml-4 truncate">Typing Levels</h1>
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

      <main className="flex-1 container mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Choose Your Challenge</h2>
          <p className="text-muted-foreground">Complete levels to unlock new challenges and earn XP!</p>
          <div className="mt-2 text-sm text-muted-foreground">
            Current Level: {userProfile.level} • Total XP: {userProfile.totalXP}
          </div>
          <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm">
            <p className="font-medium">Level Progression</p>
            <p className="text-muted-foreground mt-1">Your profile level increases as you earn XP. Challenge levels unlock at specific profile levels:</p>
            <ul className="text-muted-foreground mt-1 list-disc list-inside">
              <li>Level 2: Unlock at profile level 2</li>
              <li>Level 3: Unlock at profile level 4</li>
              <li>Level 4: Unlock at profile level 7</li>
              <li>Level 5: Unlock at profile level 10</li>
              <li>Level 6 (Expert): Unlock at profile level 15</li>
            </ul>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const resetProfile = resetUserProfile();
                  setUserProfile(resetProfile);
                  alert('Profile reset! Refresh the page to see changes.');
                }}
              >
                Reset Profile Data
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => {
            const IconComponent = level.icon
            const isUnlocked = userProfile.unlockedLevels.includes(level.id)

            return (
              <Card key={level.id} className={`relative ${!isUnlocked ? "opacity-60" : ""}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-5 w-5 ${level.color}`} />
                      <CardTitle>{level.title}</CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                        ${level.difficulty === "Beginner" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                        ${level.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : ""}
                        ${level.difficulty === "Advanced" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" : ""}
                        ${level.difficulty === "Expert" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : ""}
                      `}
                    >
                      {level.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{level.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{level.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Earn up to {level.xp}+ XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{level.description}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {isUnlocked ? (
                    <Button asChild className="w-full">
                      <Link href={`/play?level=${level.id}`}>Start Level</Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Reach Profile Level {level.id === 2 ? 2 : 
                                           level.id === 3 ? 4 : 
                                           level.id === 4 ? 7 : 
                                           level.id === 5 ? 10 : 15} to Unlock
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
