"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Play, Trophy, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { getUserProfile, type UserProfile } from "@/lib/user-storage"
import Image from "next/image"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const profile = getUserProfile()
    setUserProfile(profile)
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/play", label: "Play", icon: Play },
    { href: "/levels", label: "Levels", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-2 px-2 mb-4">
            <Image src="/images/logo.svg" alt="SuperType Logo" width={30} height={30} className="dark:invert" />
            <h2 className="text-xl font-bold">SuperType</h2>
          </div>

          {userProfile && (
            <div className="flex items-center gap-2 px-2 mb-4">
              <span className="text-lg">{userProfile.avatar}</span>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Welcome back,</span>
                <span className="font-medium">{userProfile.username}</span>
              </div>
            </div>
          )}

          {navItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href || (item.href === "/play" && pathname.startsWith("/play"))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          <div className="mt-4 px-3">
            <ModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
