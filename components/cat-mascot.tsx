"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface CatMascotProps {
  isTyping?: boolean
  hasCompleted?: boolean
}

export function CatMascot({ isTyping = false, hasCompleted = false }: CatMascotProps) {
  const [message, setMessage] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  const encouragements = [
    "You're doing great!",
    "Keep it up!",
    "Nice typing!",
    "You're getting faster!",
    "Purrfect typing!",
    "Meow-velous job!",
    "You're on a roll!",
    "Focus on accuracy!",
    "Smooth and steady!",
  ]

  const completionMessages = [
    "Amazing work! 🎉",
    "Purrfect performance!",
    "You're a typing star! ⭐",
    "Meow-nificent job!",
    "Level completed! 🏆",
  ]

  useEffect(() => {
    if (hasCompleted) {
      const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)]
      setMessage(randomMessage)
      setIsAnimating(true)

      setTimeout(() => {
        setIsAnimating(false)
        setMessage("")
      }, 3000)
      return
    }

    if (!isTyping) return

    const interval = setInterval(() => {
      const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)]
      setMessage(randomMessage)
      setIsAnimating(true)

      setTimeout(() => {
        setIsAnimating(false)
        setMessage("")
      }, 2000)
    }, 8000)

    return () => clearInterval(interval)
  }, [isTyping, hasCompleted])

  const getCatImage = () => {
    if (hasCompleted) return "/images/cat-celebrating.svg"
    if (isTyping) return "/images/cat-typing.svg"
    return "/images/cat-mascot.svg"
  }

  const getCatAlt = () => {
    if (hasCompleted) return "Celebrating cat mascot"
    if (isTyping) return "Cat mascot typing"
    return "Friendly cat mascot"
  }

  return (
    <div className="relative flex flex-col items-center">
      {message && (
        <div
          className={`absolute -top-16 bg-background border rounded-lg px-4 py-2 text-center transition-all duration-300 shadow-lg ${
            isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <p className="text-sm font-medium">{message}</p>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-background border-r border-b"></div>
        </div>
      )}

      <div
        className={`transition-all duration-300 ${isAnimating ? "scale-110" : "scale-100"} ${hasCompleted ? "animate-bounce" : ""}`}
      >
        <Image
          src={getCatImage() || "/placeholder.svg"}
          alt={getCatAlt()}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>
    </div>
  )
}
