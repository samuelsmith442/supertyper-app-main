export interface UserProfile {
  id: string
  username: string
  avatar: string
  level: number
  totalXP: number
  xpToNextLevel: number
  currentLevelXP: number
  averageWPM: number
  bestWPM: number
  averageAccuracy: number
  totalTests: number
  totalTimeTyped: number
  achievements: string[]
  unlockedLevels: number[]
  testHistory: TestResult[]
  createdAt: string
  lastActive: string
  soundSettings: {
    enabled: boolean
    volume: number
  }
}

export interface TestResult {
  id: string
  level: number
  wpm: number
  accuracy: number
  xpEarned: number
  timeSpent: number
  completedAt: string
  textLength: number
}

const STORAGE_KEY = "supertype_user_profile"

export const defaultProfile: UserProfile = {
  id: crypto.randomUUID(),
  username: "TypeMaster",
  avatar: "🐱",
  level: 1,
  totalXP: 0,
  xpToNextLevel: 100,
  currentLevelXP: 0,
  averageWPM: 0,
  bestWPM: 0,
  averageAccuracy: 0,
  totalTests: 0,
  totalTimeTyped: 0,
  achievements: [],
  unlockedLevels: [1],
  testHistory: [],
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  soundSettings: {
    enabled: true,
    volume: 0.3
  },
}

export const getUserProfile = (): UserProfile => {
  if (typeof window === "undefined") return defaultProfile

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const profile = JSON.parse(stored)
      // Ensure all required fields exist (for backwards compatibility)
      return { ...defaultProfile, ...profile }
    }
  } catch (error) {
    console.error("Error loading user profile:", error)
  }

  return defaultProfile
}

export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window === "undefined") return

  try {
    profile.lastActive = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch (error) {
    console.error("Error saving user profile:", error)
  }
}

export const updateUserProfile = (updates: Partial<UserProfile>): UserProfile => {
  const currentProfile = getUserProfile()
  const updatedProfile = { ...currentProfile, ...updates }
  saveUserProfile(updatedProfile)
  return updatedProfile
}

export const addTestResult = (testResult: Omit<TestResult, "id" | "completedAt">): UserProfile => {
  const profile = getUserProfile()

  const newTestResult: TestResult = {
    ...testResult,
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  }

  // Update test history
  const updatedHistory = [newTestResult, ...profile.testHistory].slice(0, 50) // Keep last 50 tests

  // Calculate new averages
  const totalTests = profile.totalTests + 1
  const totalTimeTyped = profile.totalTimeTyped + testResult.timeSpent
  const newAverageWPM = Math.round((profile.averageWPM * profile.totalTests + testResult.wpm) / totalTests)
  const newAverageAccuracy = Math.round(
    (profile.averageAccuracy * profile.totalTests + testResult.accuracy) / totalTests,
  )
  const newBestWPM = Math.max(profile.bestWPM, testResult.wpm)

  // Calculate XP and level progression
  const newTotalXP = profile.totalXP + testResult.xpEarned
  let newLevel = profile.level
  let newCurrentLevelXP = profile.currentLevelXP + testResult.xpEarned
  let newXpToNextLevel = profile.xpToNextLevel

  // Level up logic
  while (newCurrentLevelXP >= newXpToNextLevel) {
    newCurrentLevelXP -= newXpToNextLevel
    newLevel++
    newXpToNextLevel = getXPRequiredForLevel(newLevel + 1) - getXPRequiredForLevel(newLevel)
  }

  // Unlock new levels based on current level
  const unlockedLevels = Array.from(new Set([...profile.unlockedLevels, ...getUnlockedLevels(newLevel)]))

  // Check for new achievements
  const newAchievements = checkAchievements(profile, {
    totalTests,
    bestWPM: newBestWPM,
    averageAccuracy: newAverageAccuracy,
    totalTimeTyped,
    level: newLevel,
    testResult: newTestResult,
  })

  const updatedProfile: UserProfile = {
    ...profile,
    level: newLevel,
    totalXP: newTotalXP,
    xpToNextLevel: newXpToNextLevel,
    currentLevelXP: newCurrentLevelXP,
    averageWPM: newAverageWPM,
    bestWPM: newBestWPM,
    averageAccuracy: newAverageAccuracy,
    totalTests,
    totalTimeTyped,
    achievements: newAchievements,
    unlockedLevels,
    testHistory: updatedHistory,
  }

  saveUserProfile(updatedProfile)
  return updatedProfile
}

const getXPRequiredForLevel = (level: number): number => {
  // More challenging XP requirements with steeper progression
  return level * 150 + Math.pow(level - 1, 2) * 25 // Exponential XP requirements
}

const getUnlockedLevels = (currentLevel: number): number[] => {
  const levels = [1]
  // More challenging level unlock requirements
  if (currentLevel >= 2) levels.push(2) // Unlock level 2 at profile level 2
  if (currentLevel >= 4) levels.push(3) // Unlock level 3 at profile level 4
  if (currentLevel >= 7) levels.push(4) // Unlock level 4 at profile level 7
  if (currentLevel >= 10) levels.push(5) // Unlock level 5 at profile level 10
  if (currentLevel >= 15) levels.push(6) // Unlock level 6 (Expert) at profile level 15
  return levels
}

const checkAchievements = (
  profile: UserProfile,
  stats: {
    totalTests: number
    bestWPM: number
    averageAccuracy: number
    totalTimeTyped: number
    level: number
    testResult: TestResult
  },
): string[] => {
  const achievements = new Set(profile.achievements)

  // First Steps
  if (stats.totalTests >= 1) achievements.add("First Steps")

  // Speed Demon
  if (stats.bestWPM >= 50) achievements.add("Speed Demon")

  // Accuracy Expert
  if (stats.averageAccuracy >= 95) achievements.add("Accuracy Expert")

  // Consistent Typer
  if (stats.totalTests >= 10) achievements.add("Consistent Typer")

  // Marathon Typer (1 hour = 3600 seconds)
  if (stats.totalTimeTyped >= 3600) achievements.add("Marathon Typer")

  // Perfectionist
  if (stats.testResult.accuracy === 100) achievements.add("Perfectionist")

  // Level Master
  if (stats.level >= 5) achievements.add("Level Master")

  // Speed Racer
  if (stats.bestWPM >= 80) achievements.add("Speed Racer")

  return Array.from(achievements)
}

export const resetUserProfile = (): UserProfile => {
  const newProfile = { ...defaultProfile, id: crypto.randomUUID() }
  saveUserProfile(newProfile)
  return newProfile
}
