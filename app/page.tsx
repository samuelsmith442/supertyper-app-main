"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ProfileSetup } from "@/components/profile-setup"
import Link from "next/link"
import Image from "next/image"
import { getUserProfile, updateUserProfile, type UserProfile } from "@/lib/user-storage"
import { MobileNav } from "@/components/mobile-nav"

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    const profile = getUserProfile()
    setUserProfile(profile)

    // Show setup if this is a new user (no tests completed)
    if (profile.totalTests === 0 && profile.username === "TypeMaster") {
      setShowSetup(true)
    }
  }, [])

  const handleProfileSetup = (username: string, avatar: string) => {
    const updatedProfile = updateUserProfile({ username, avatar })
    setUserProfile(updatedProfile)
    setShowSetup(false)
  }

  if (showSetup) {
    return (
      <ProfileSetup
        onComplete={handleProfileSetup}
        initialUsername={userProfile?.username}
        initialAvatar={userProfile?.avatar}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Image src="/images/logo.svg" alt="SuperType Logo" width={40} height={40} className="dark:invert" />
              <h1 className="text-xl sm:text-2xl font-bold">SuperType</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userProfile && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <span className="text-sm text-muted-foreground">Welcome back,</span>
                <span className="font-medium">{userProfile.username}</span>
                <span className="text-lg">{userProfile.avatar}</span>
              </div>
            )}

            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/profile">Profile</Link>
            </Button>

            <div className="hidden sm:block">
              <ModeToggle />
            </div>
            
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center p-4 gap-8">
        <div className="flex-1 max-w-xl space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Become a <span className="text-primary">typing master</span> with SuperType
          </h2>
          <p className="text-xl text-muted-foreground">
            Improve your typing speed and accuracy with our fun, gamified approach. Complete levels, earn XP, and watch
            your skills grow!
          </p>

          {userProfile && userProfile.totalTests > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Your Progress</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Level</p>
                  <p className="font-bold text-lg">{userProfile.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Best WPM</p>
                  <p className="font-bold text-lg">{userProfile.bestWPM}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Tests</p>
                  <p className="font-bold text-lg">{userProfile.totalTests}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/play">Start Typing</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
              <Link href="/levels">View Levels</Link>
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-md aspect-square">
          <Image
            src="/images/cat-mascot.svg"
            alt="SuperType Cat Mascot - A friendly cat ready to help you improve your typing"
            fill
            className="object-contain"
            priority
          />
        </div>
      </main>

      <footer className="container mx-auto p-4 border-t">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2025 SuperType</p>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/stats" className="text-sm text-muted-foreground hover:text-foreground">
              Stats
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
