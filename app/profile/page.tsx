"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { ArrowLeft, Trophy, Zap, Target, Clock, Star, Award, TrendingUp, Edit, RotateCcw } from "lucide-react"
import { getUserProfile, updateUserProfile, resetUserProfile, type UserProfile } from "@/lib/user-storage"

const achievementsList = [
  { name: "First Steps", description: "Complete your first typing test", icon: Star },
  { name: "Speed Demon", description: "Reach 50 WPM", icon: Zap },
  { name: "Accuracy Expert", description: "Achieve 95% average accuracy", icon: Target },
  { name: "Consistent Typer", description: "Complete 10 tests", icon: Trophy },
  { name: "Marathon Typer", description: "Type for 1 hour total", icon: Clock },
  { name: "Perfectionist", description: "Complete a test with 100% accuracy", icon: Award },
  { name: "Level Master", description: "Reach level 5", icon: Trophy },
  { name: "Speed Racer", description: "Reach 80 WPM", icon: Zap },
]

const avatarOptions = ["🐱", "🐶", "🦊", "🐼", "🐨", "🦁", "🐯", "🐸", "🐧", "🦉", "🦄", "🐲"]

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editUsername, setEditUsername] = useState("")
  const [editAvatar, setEditAvatar] = useState("")

  useEffect(() => {
    const profile = getUserProfile()
    setUserProfile(profile)
    setEditUsername(profile.username)
    setEditAvatar(profile.avatar)
  }, [])

  const handleSaveProfile = () => {
    if (userProfile && editUsername.trim()) {
      const updatedProfile = updateUserProfile({
        username: editUsername.trim(),
        avatar: editAvatar,
      })
      setUserProfile(updatedProfile)
      setIsEditing(false)
    }
  }

  const handleResetProfile = () => {
    const newProfile = resetUserProfile()
    setUserProfile(newProfile)
    setEditUsername(newProfile.username)
    setEditAvatar(newProfile.avatar)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const levelProgress = (userProfile.currentLevelXP / userProfile.xpToNextLevel) * 100

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Link>
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold ml-2 sm:ml-4 flex-1 text-center sm:text-left">Profile</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-3xl">{userProfile.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{userProfile.username}</h2>
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Update your username and avatar</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-username">Username</Label>
                          <Input
                            id="edit-username"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            maxLength={20}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label>Avatar</Label>
                          <div className="flex justify-center mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="text-2xl">{editAvatar}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="grid grid-cols-6 gap-2">
                            {avatarOptions.map((avatar) => (
                              <button
                                key={avatar}
                                type="button"
                                onClick={() => setEditAvatar(avatar)}
                                className={`p-2 rounded-lg border-2 transition-colors ${
                                  editAvatar === avatar
                                    ? "border-primary bg-primary/10"
                                    : "border-muted hover:border-primary/50"
                                }`}
                              >
                                <span className="text-xl">{avatar}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile} className="flex-1">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-primary/10">
                    Level {userProfile.level}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{userProfile.totalXP} XP total</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level Progress</span>
                    <span>{userProfile.xpToNextLevel} XP to next level</span>
                  </div>
                  <Progress value={levelProgress} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Member since {formatDate(userProfile.createdAt)} • Last active{" "}
                  {getRelativeTime(userProfile.lastActive)}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Average WPM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.averageWPM}</div>
              <p className="text-xs text-muted-foreground">words per minute</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Best WPM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.bestWPM}</div>
              <p className="text-xs text-muted-foreground">personal record</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.averageAccuracy}%</div>
              <p className="text-xs text-muted-foreground">average accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                Time Typed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(userProfile.totalTimeTyped)}</div>
              <p className="text-xs text-muted-foreground">total practice time</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements ({userProfile.achievements.length}/{achievementsList.length})
            </CardTitle>
            <CardDescription>Unlock achievements by completing challenges and improving your skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievementsList.map((achievement) => {
                const IconComponent = achievement.icon
                const isUnlocked = userProfile.achievements.includes(achievement.name)
                return (
                  <div
                    key={achievement.name}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isUnlocked ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-muted opacity-60"
                    }`}
                  >
                    <IconComponent className={`h-8 w-8 ${isUnlocked ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {isUnlocked && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        ✓
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Tests</CardTitle>
                <CardDescription>Your latest typing test results</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetProfile}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userProfile.testHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tests completed yet</p>
                <Button asChild className="mt-4">
                  <Link href="/play">Start Your First Test</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userProfile.testHistory.slice(0, 10).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium text-sm">Level {test.level}</p>
                        <p className="text-xs text-muted-foreground">{getRelativeTime(test.completedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{test.wpm} WPM</span>
                      <span>{test.accuracy}%</span>
                      <Badge variant="outline" className="bg-primary/10">
                        +{test.xpEarned} XP
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
