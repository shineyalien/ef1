/**
 * UUID Generation Utility
 * 
 * Provides safe UUID generation with fallbacks for older browsers
 * that don't support crypto.randomUUID()
 */

// Fallback UUID generator for older browsers
export function generateFallbackUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Safe UUID generation with fallback
export function generateUUID(): string {
  try {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : generateFallbackUUID()
  } catch (error) {
    console.warn('Failed to generate UUID using crypto.randomUUID, using fallback:', error)
    return generateFallbackUUID()
  }
}

// Validate if a string is a valid UUID
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Generate a UUID with error handling and logging
export function safeGenerateUUID(context?: string): string {
  try {
    const uuid = generateUUID()
    if (process.env.NODE_ENV === 'development' && context) {
      console.log(`Generated UUID for ${context}:`, uuid)
    }
    return uuid
  } catch (error) {
    console.error(`Failed to generate UUID${context ? ` for ${context}` : ''}:`, error)
    // As a last resort, generate a simple timestamp-based ID
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}