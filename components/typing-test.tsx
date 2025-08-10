"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Timer, RotateCcw } from "lucide-react"
import { addTestResult, getUserProfile } from "@/lib/user-storage"
import { SmartTextSelector } from "@/components/smart-text-selector"
import { trackTypingErrors, storeTypingErrors } from "@/lib/smart-text-generator"
import { useSounds } from "@/lib/use-sound"

const levelTexts = {
  1: [
    "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet.",
    "Practice makes perfect when it comes to typing speed and accuracy.",
    "Consistent daily practice will help you become a faster and more accurate typist.",
  ],
  2: [
    "The early bird catches the worm, but the second mouse gets the cheese.",
    "A journey of a thousand miles begins with a single step forward.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  ],
  3: [
    "Hello, world! This is a test of punctuation, numbers (123), and symbols (@#$%).",
    "Can you type this correctly? It includes: commas, periods, and question marks!",
    "Programming requires precision: semicolons; brackets []; and parentheses ().",
  ],
  4: [
    "Variables: let x = 42; const PI = 3.14159; var name = 'TypeScript';",
    "Functions: function add(a: number, b: number): number { return a + b; }",
    "Arrays: const numbers = [1, 2, 3, 4, 5]; const sum = numbers.reduce((a, b) => a + b);",
  ],
  5: [
    "import React from 'react'; const Component = () => { return <div>Hello</div>; };",
    "SELECT * FROM users WHERE age > 18 AND status = 'active' ORDER BY created_at DESC;",
    "git commit -m 'feat: add new typing challenge levels with code snippets'",
  ],
  6: [
    "The ultimate typing challenge: combining speed, accuracy, and complex text patterns!",
    "Advanced programmers must master: async/await, destructuring, and type annotations.",
    "Performance optimization requires understanding: algorithms, data structures, and complexity analysis.",
  ],
}

interface TypingTestProps {
  onStateChange?: (isTyping: boolean, hasCompleted: boolean) => void
  level?: number
  onTestComplete?: () => void
}

export function TypingTest({ onStateChange, level = 1, onTestComplete }: TypingTestProps) {
  const [inputText, setInputText] = useState("")
  const [currentText, setCurrentText] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [xpEarned, setXpEarned] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Add sound functionality
  const { initializeSounds, playSound } = useSounds()
  const [soundSettings, setSoundSettings] = useState(() => {
    const profile = getUserProfile()
    return profile.soundSettings
  })

  // Set time limit based on level
  const getTimeLimit = (level: number) => {
    const timeLimits = { 1: 30, 2: 45, 3: 60, 4: 60, 5: 90, 6: 120 }
    return timeLimits[level as keyof typeof timeLimits] || 30
  }

  useEffect(() => {
    onStateChange?.(isActive, hasCompleted)
  }, [isActive, hasCompleted, onStateChange])
  
  // Initialize sounds
  useEffect(() => {
    initializeSounds()
  }, [initializeSounds])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (interval) clearInterval(interval)
      handleTestComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const startTest = (customText?: string) => {
    let textToUse = customText || ""
    
    if (!textToUse) {
      const texts = levelTexts[level as keyof typeof levelTexts] || levelTexts[1]
      textToUse = texts[Math.floor(Math.random() * texts.length)]
    }
    
    // Ensure textToUse is a string
    textToUse = String(textToUse)
    
    const timeLimit = getTimeLimit(level)

    setCurrentText(textToUse)
    setInputText("")
    setStartTime(Date.now())
    setEndTime(null)
    setWpm(null)
    setAccuracy(null)
    setXpEarned(null)
    setTimeLeft(timeLimit)
    setIsActive(true)
    setHasCompleted(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleTestComplete = () => {
    setIsActive(false)
    setEndTime(Date.now())
    setHasCompleted(true)
    playSound('complete', soundSettings)

    if (startTime) {
      const timeSpent = (Date.now() - startTime) / 1000
      const timeInMinutes = timeSpent / 60
      const wordsTyped = inputText.trim().split(/\s+/).length
      const calculatedWpm = Math.round(wordsTyped / timeInMinutes)

      // Ensure currentText is a string
      const textToAnalyze = String(currentText || "")
      
      // Calculate accuracy
      const originalChars = textToAnalyze.split("")
      const typedChars = inputText.split("")
      let correctChars = 0
      const errors: Array<{ char: string, context: string }> = []

      typedChars.forEach((char, index) => {
        if (index < originalChars.length && char === originalChars[index]) {
          correctChars++
        } else if (index < originalChars.length) {
          // Track errors for smart text generation
          errors.push({
            char: originalChars[index],
            context: textToAnalyze.substring(Math.max(0, index - 2), Math.min(textToAnalyze.length, index + 3))
          })
        }
      })

      const calculatedAccuracy = Math.round((correctChars / Math.max(typedChars.length, 1)) * 100)

      // Store typing errors for smart text generation
      if (errors.length > 0) {
        storeTypingErrors(errors)
      }

      // Calculate XP
      const baseXP = [50, 100, 150, 200, 300, 500][level - 1] || 50
      const speedBonus = Math.max(0, calculatedWpm - 30) * 2
      const accuracyBonus = Math.max(0, calculatedAccuracy - 80) * 1
      const calculatedXP = Math.round(baseXP + speedBonus + accuracyBonus)

      setWpm(calculatedWpm)
      setAccuracy(calculatedAccuracy)
      setXpEarned(calculatedXP)

      // Save test result to user profile
      addTestResult({
        level,
        wpm: calculatedWpm,
        accuracy: calculatedAccuracy,
        xpEarned: calculatedXP,
        timeSpent: Math.round(timeSpent),
        textLength: currentText.length,
      })

      onTestComplete?.()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    const lastChar = newText[newText.length - 1]
    const expectedChar = currentText[newText.length - 1]

    // Only play error sound for incorrect keystrokes
    if (lastChar !== undefined && lastChar !== expectedChar) {
      playSound('error', soundSettings)
    }

    setInputText(newText)

    if (newText === currentText) {
      playSound('complete', soundSettings)
      handleTestComplete()
    }
  }

  const resetTest = () => {
    setInputText("")
    setCurrentText("")
    setStartTime(null)
    setEndTime(null)
    setWpm(null)
    setAccuracy(null)
    setXpEarned(null)
    setTimeLeft(getTimeLimit(level))
    setIsActive(false)
    setHasCompleted(false)
  }

  // Handle text selection from smart text generator
  const handleSmartTextSelected = (text: string) => {
    if (!isActive) {
      startTest(text)
    }
  }

  return (
    <div className="space-y-6">
      {/* Smart Text Selector */}
      <SmartTextSelector level={level} onTextSelected={handleSmartTextSelected} />
      
      <Card className="relative">
        <CardContent className="p-6">
          <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground">
            <Timer className="h-4 w-4" />
            <span className="font-mono text-lg">{timeLeft}s</span>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Level {level}</span>
              <span>•</span>
              <span>{getTimeLimit(level)} seconds</span>
            </div>
          </div>

          {currentText && (
            <p className="text-lg leading-relaxed mb-6 font-mono">
              {String(currentText).split("").map((char, index) => {
                let className = "transition-colors duration-150"

                if (index < inputText.length) {
                  className +=
                    inputText[index] === char
                      ? " text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
                      : " text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
                } else if (index === inputText.length) {
                  className += " bg-primary/20 animate-pulse"
                }

                return (
                  <span key={index} className={className}>
                    {char}
                  </span>
                )
              })}
            </p>
          )}

          <Input
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            disabled={!isActive}
            placeholder={isActive ? "Start typing..." : "Click Start to begin"}
            className="text-lg font-mono"
          />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button 
            onClick={() => startTest()} 
            size="lg" 
            disabled={isActive} 
            className="w-full sm:w-auto"
          >
            {wpm !== null ? "Try Again" : "Start Test"}
          </Button>
          {(wpm !== null || isActive) && (
            <Button onClick={resetTest} variant="outline" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {wpm !== null && (
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Speed</p>
              <p className="text-2xl font-bold text-primary">{wpm} WPM</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-primary">{accuracy}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">XP Earned</p>
              <p className="text-2xl font-bold text-yellow-500">+{xpEarned}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
