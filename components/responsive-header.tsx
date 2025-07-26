"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import type { UserProfile } from "@/lib/user-storage"

interface ResponsiveHeaderProps {
  title: string
  backHref?: string
  backLabel?: string
  showLogo?: boolean
  userProfile?: UserProfile | null
  compact?: boolean
}

export function ResponsiveHeader({
  title,
  backHref,
  backLabel = "Back",
  showLogo = false,
  userProfile,
  compact = false,
}: ResponsiveHeaderProps) {
  return (
    <header className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showLogo && <MobileNav />}

          {backHref && (
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href={backHref}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">{backLabel}</span>
              </Link>
            </Button>
          )}

          {showLogo && (
            <Image
              src="/images/logo.svg"
              alt="SuperType Logo"
              width={40}
              height={40}
              className="dark:invert shrink-0"
            />
          )}

          <h1
            className={`font-bold truncate ${
              compact ? "text-sm sm:text-lg md:text-xl ml-2 sm:ml-4" : "text-lg sm:text-2xl ml-2 sm:ml-4"
            } ${showLogo ? "" : "text-center sm:text-left flex-1"}`}
          >
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {userProfile && showLogo && (
            <>
              <div className="hidden md:flex items-center gap-2 mr-2">
                <span className="text-sm text-muted-foreground">Welcome back,</span>
                <span className="font-medium">{userProfile.username}</span>
                <span className="text-lg">{userProfile.avatar}</span>
              </div>

              <div className="md:hidden flex items-center gap-1 mr-2">
                <span className="text-lg">{userProfile.avatar}</span>
                <span className="font-medium text-sm max-w-[80px] truncate">{userProfile.username}</span>
              </div>
            </>
          )}

          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/profile">Profile</Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="sm:hidden">
            <Link href="/profile">
              <span className="text-lg">👤</span>
              <span className="sr-only">Profile</span>
            </Link>
          </Button>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
