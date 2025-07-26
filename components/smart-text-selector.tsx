"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import { generateSmartText, getStoredTypingErrors } from "@/lib/smart-text-generator"
import { getUserProfile } from "@/lib/user-storage"

interface SmartTextSelectorProps {
  level: number
  onTextSelected: (text: string) => void
}

export function SmartTextSelector({ level, onTextSelected }: SmartTextSelectorProps) {
  const [useSmartText, setUseSmartText] = useState(false)
  const [generatedText, setGeneratedText] = useState("")
  const [userProfile, setUserProfile] = useState(getUserProfile())

  // Generate text when component mounts or when toggle changes
  useEffect(() => {
    if (useSmartText) {
      generateText()
    }
  }, [useSmartText, level])

  const generateText = () => {
    // Get stored typing errors
    const errors = getStoredTypingErrors()
    
    // Generate text based on user profile and errors
    const text = generateSmartText(userProfile, errors)
    setGeneratedText(text)
  }

  const handleToggleChange = (checked: boolean) => {
    setUseSmartText(checked)
    
    // If turning on smart text, generate and select it
    if (checked && !generatedText) {
      const text = generateSmartText(userProfile, getStoredTypingErrors())
      setGeneratedText(text)
      onTextSelected(text)
    }
  }

  const handleUseText = () => {
    onTextSelected(generatedText)
  }

  const handleRegenerateText = () => {
    generateText()
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Smart Text Generator
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="smart-text-mode"
              checked={useSmartText}
              onCheckedChange={handleToggleChange}
            />
            <Label htmlFor="smart-text-mode">Enable</Label>
          </div>
        </div>
        <CardDescription>
          {useSmartText
            ? "Using AI to generate text based on your typing patterns"
            : "Turn on to get personalized typing challenges"}
        </CardDescription>
      </CardHeader>
      
      {useSmartText && (
        <>
          <CardContent>
            <div className="bg-muted/50 rounded-md p-3 text-sm">
              <p className="line-clamp-3">{generatedText || "Generating personalized text..."}</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerateText}
            >
              Regenerate
            </Button>
            <Button 
              size="sm" 
              onClick={handleUseText}
            >
              Use This Text
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
