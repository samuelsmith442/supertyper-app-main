// Smart Text Generator
// Generates customized typing texts based on user performance data

import type { UserProfile } from "./user-storage";

// Types for tracking error patterns
interface ErrorPattern {
  character: string;
  count: number;
  context?: string[];
}

interface CharacterPair {
  pair: string;
  count: number;
}

// Template texts for different categories
const templates = {
  basic: [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Amazingly few discotheques provide jukeboxes.",
  ],
  common: [
    "Please send the reports to everyone by email.",
    "The meeting is scheduled for next Tuesday at noon.",
    "Remember to save your work before closing the application.",
    "Could you please confirm your reservation for dinner tonight?",
    "Thank you for your prompt response to our inquiry.",
  ],
  technical: [
    "function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }",
    "const userData = await fetchUserProfile(userId); if (userData.status === 200) { renderProfile(userData); }",
    "SELECT users.name, orders.date FROM users JOIN orders ON users.id = orders.user_id WHERE orders.status = 'completed';",
    "git commit -m 'Fix: resolve issue with authentication middleware' && git push origin main",
    "<div className=\"container mx-auto p-4\"><h1 className=\"text-2xl font-bold\">Welcome</h1></div>",
  ],
  punctuation: [
    "Wait! Did you hear that? Someone's at the door; I'll check who it is.",
    "\"To be, or not to be: that is the question,\" wrote Shakespeare in Hamlet.",
    "The package contains: three books, two pens, and a notebook (all new).",
    "Can you believe it?! We won the championship — our first in 20 years!",
    "Please review the document; add comments, if necessary; and return it by Friday.",
  ],
  numbers: [
    "In 2023, approximately 45% of the 8,500 participants completed the 26.2 mile marathon.",
    "The password must contain at least 1 uppercase letter, 2 numbers, and 3 special characters.",
    "The company reported $1,250,000 in revenue for Q3, up 15% from the $1,087,500 in Q2.",
    "Dial 1-800-555-0123 to reach customer service, available 24/7/365.",
    "The recipe calls for 2 cups of flour, 1/3 cup of sugar, and 3/4 teaspoon of salt.",
  ],
};

// Character groups for targeting specific practice
const characterGroups = {
  leftHand: "qwertasdfgzxcv",
  rightHand: "yuiophjklbnm",
  topRow: "qwertyuiop",
  homeRow: "asdfghjkl",
  bottomRow: "zxcvbnm",
  numbers: "1234567890",
  symbols: "!@#$%^&*()_+-=[]{}|;':\",./<>?\\",
  punctuation: ".,;:!?-\"'()",
};

/**
 * Analyzes typing errors to identify patterns
 * @param errors Array of error objects with character and context
 * @returns Object containing problematic characters and combinations
 */
export function analyzeErrors(errors: Array<{ char: string, context?: string }>) {
  const problemChars: Record<string, ErrorPattern> = {};
  const problemPairs: Record<string, CharacterPair> = {};
  
  // Count individual character errors
  errors.forEach(error => {
    const char = error.char;
    
    if (!problemChars[char]) {
      problemChars[char] = { character: char, count: 0, context: [] };
    }
    
    problemChars[char].count++;
    
    if (error.context) {
      problemChars[char].context = [
        ...(problemChars[char].context || []),
        error.context
      ].slice(0, 5); // Keep only the last 5 contexts
    }
    
    // Track character pairs (the character before and after errors)
    if (error.context && error.context.length >= 3) {
      const index = error.context.indexOf(char);
      if (index > 0 && index < error.context.length - 1) {
        const prevChar = error.context[index - 1];
        const nextChar = error.context[index + 1];
        
        const prevPair = prevChar + char;
        const nextPair = char + nextChar;
        
        if (!problemPairs[prevPair]) {
          problemPairs[prevPair] = { pair: prevPair, count: 0 };
        }
        problemPairs[prevPair].count++;
        
        if (!problemPairs[nextPair]) {
          problemPairs[nextPair] = { pair: nextPair, count: 0 };
        }
        problemPairs[nextPair].count++;
      }
    }
  });
  
  // Sort by count (most problematic first)
  const sortedChars = Object.values(problemChars).sort((a, b) => b.count - a.count);
  const sortedPairs = Object.values(problemPairs).sort((a, b) => b.count - a.count);
  
  return {
    problemChars: sortedChars.slice(0, 10), // Top 10 problem characters
    problemPairs: sortedPairs.slice(0, 10), // Top 10 problem pairs
  };
}

/**
 * Generates a custom practice text based on user's problem areas
 * @param userProfile User profile with typing history
 * @param errors Recent typing errors
 * @returns A customized text for practice
 */
export function generateSmartText(
  userProfile: UserProfile,
  errors: Array<{ char: string, context?: string }> = []
): string {
  // If no errors provided, generate a text based on level
  if (errors.length === 0) {
    return generateLevelBasedText(userProfile.level);
  }
  
  // Analyze errors to find problem areas
  const { problemChars, problemPairs } = analyzeErrors(errors);
  
  // If we have identified problem characters
  if (problemChars.length > 0) {
    return generateTargetedText(problemChars, problemPairs, userProfile.level);
  }
  
  // Fallback to level-based text
  return generateLevelBasedText(userProfile.level);
}

/**
 * Generates text focused on problem characters and combinations
 */
function generateTargetedText(
  problemChars: ErrorPattern[],
  problemPairs: CharacterPair[],
  level: number
): string {
  // Get the top problem characters and pairs
  const topChars = problemChars.slice(0, 5).map(p => p.character);
  const topPairs = problemPairs.slice(0, 3).map(p => p.pair);
  
  // Select template category based on level
  let category: keyof typeof templates = 'basic';
  
  if (level <= 2) category = 'basic';
  else if (level <= 4) category = 'common';
  else if (level === 5) category = 'technical';
  else if (level === 3) category = 'punctuation';
  else if (level === 4) category = 'numbers';
  
  // Get templates from the category
  const categoryTemplates = templates[category];
  
  // Select a base template
  const baseTemplate = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  
  // Create a sentence that incorporates problem characters and pairs
  let customSentence = createCustomSentence(topChars, topPairs);
  
  // Combine the template with our custom sentence
  return `${baseTemplate} ${customSentence}`;
}

/**
 * Creates a sentence that incorporates problem characters and pairs
 */
function createCustomSentence(problemChars: string[], problemPairs: string[]): string {
  // Common words containing the problem characters
  const wordsByChar: Record<string, string[]> = {
    'a': ['amazing', 'application', 'available', 'advantage', 'actually'],
    'b': ['between', 'because', 'business', 'beautiful', 'building'],
    'c': ['complete', 'consider', 'continue', 'company', 'character'],
    'd': ['different', 'development', 'document', 'direction', 'decision'],
    'e': ['everything', 'experience', 'example', 'environment', 'especially'],
    'f': ['following', 'function', 'feature', 'feedback', 'forward'],
    'g': ['general', 'government', 'generation', 'growing', 'greatest'],
    'h': ['however', 'history', 'himself', 'hundred', 'happened'],
    'i': ['important', 'information', 'including', 'industry', 'interest'],
    'j': ['journey', 'justice', 'joining', 'judgment', 'justify'],
    'k': ['knowledge', 'keeping', 'kitchen', 'kingdom', 'keyboard'],
    'l': ['looking', 'learning', 'language', 'leadership', 'location'],
    'm': ['management', 'material', 'movement', 'mentioned', 'multiple'],
    'n': ['national', 'necessary', 'network', 'nothing', 'northern'],
    'o': ['operation', 'opportunity', 'organization', 'obviously', 'otherwise'],
    'p': ['position', 'particular', 'performance', 'population', 'political'],
    'q': ['question', 'quality', 'quickly', 'quantity', 'qualified'],
    'r': ['research', 'relationship', 'remember', 'required', 'response'],
    's': ['something', 'significant', 'structure', 'statement', 'situation'],
    't': ['together', 'technology', 'treatment', 'throughout', 'therefore'],
    'u': ['understand', 'university', 'ultimately', 'usually', 'understanding'],
    'v': ['various', 'valuable', 'version', 'variable', 'vertical'],
    'w': ['without', 'working', 'whatever', 'whether', 'welcome'],
    'x': ['example', 'experience', 'exchange', 'exercise', 'exactly'],
    'y': ['yourself', 'yesterday', 'younger', 'yearly', 'yielding'],
    'z': ['zealous', 'zooming', 'zigzag', 'zenith', 'zephyr'],
  };
  
  // Build a sentence using words that contain problem characters
  let words: string[] = [];
  
  // Add words containing problem characters
  problemChars.forEach(char => {
    const lowerChar = char.toLowerCase();
    if (wordsByChar[lowerChar]) {
      const word = wordsByChar[lowerChar][Math.floor(Math.random() * wordsByChar[lowerChar].length)];
      if (!words.includes(word)) {
        words.push(word);
      }
    }
  });
  
  // Add some connecting words
  const connectors = ['and', 'with', 'while', 'when', 'because', 'through', 'using', 'for', 'by', 'to'];
  words = [
    words.slice(0, 2).join(' '),
    connectors[Math.floor(Math.random() * connectors.length)],
    words.slice(2).join(' ')
  ];
  
  // Make sure we have a decent length sentence
  if (words.join(' ').length < 30) {
    words.push('is important for improving your typing skills');
  }
  
  // Capitalize first letter and add period
  let sentence = words.join(' ').trim();
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  if (!sentence.endsWith('.')) {
    sentence += '.';
  }
  
  return sentence;
}

/**
 * Generates text based on user level
 */
function generateLevelBasedText(level: number): string {
  let category: keyof typeof templates;
  
  // Select category based on level
  if (level <= 2) category = 'basic';
  else if (level <= 4) category = 'common';
  else if (level === 5) category = 'technical';
  else if (level === 3) category = 'punctuation';
  else if (level === 4) category = 'numbers';
  else category = 'common';
  
  // Get templates from the category
  const categoryTemplates = templates[category];
  
  // Select 2-3 templates to combine
  const numTemplates = Math.min(Math.max(Math.floor(level / 2), 1), 3);
  const selectedTemplates: string[] = [];
  
  // Select unique templates
  while (selectedTemplates.length < numTemplates) {
    const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
    if (!selectedTemplates.includes(template)) {
      selectedTemplates.push(template);
    }
  }
  
  return selectedTemplates.join(' ');
}

/**
 * Tracks typing errors during a test
 * @param originalText The text to type
 * @param typedText What the user has typed
 * @returns Array of error objects
 */
export function trackTypingErrors(originalText: string, typedText: string) {
  const errors: Array<{ char: string, context: string }> = [];
  
  // Compare each character
  for (let i = 0; i < Math.min(originalText.length, typedText.length); i++) {
    if (originalText[i] !== typedText[i]) {
      // Get some context (characters around the error)
      const start = Math.max(0, i - 2);
      const end = Math.min(originalText.length, i + 3);
      const context = originalText.substring(start, end);
      
      errors.push({
        char: originalText[i],
        context
      });
    }
  }
  
  return errors;
}

/**
 * Stores typing errors in local storage
 */
export function storeTypingErrors(errors: Array<{ char: string, context?: string }>) {
  try {
    // Get existing errors
    const storedErrors = localStorage.getItem('typingErrors');
    let allErrors = storedErrors ? JSON.parse(storedErrors) : [];
    
    // Add new errors
    allErrors = [...allErrors, ...errors];
    
    // Keep only the most recent 100 errors
    if (allErrors.length > 100) {
      allErrors = allErrors.slice(allErrors.length - 100);
    }
    
    // Save back to storage
    localStorage.setItem('typingErrors', JSON.stringify(allErrors));
  } catch (error) {
    console.error('Error storing typing errors:', error);
  }
}

/**
 * Retrieves stored typing errors from local storage
 */
export function getStoredTypingErrors(): Array<{ char: string, context?: string }> {
  try {
    const storedErrors = localStorage.getItem('typingErrors');
    return storedErrors ? JSON.parse(storedErrors) : [];
  } catch (error) {
    console.error('Error retrieving typing errors:', error);
    return [];
  }
}
