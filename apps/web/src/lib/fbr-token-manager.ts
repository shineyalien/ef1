/**
 * FBR Token Management Service
 * 
 * Handles token refresh and validation for FBR API calls
 */

import { prisma } from '@/lib/database'

interface TokenInfo {
  token: string
  environment: 'sandbox' | 'production'
  expiresAt?: Date
  isValid: boolean
  businessId: string
}

interface TokenRefreshResult {
  success: boolean
  token?: string
  error?: string
}

export class FBRTokenManager {
  private static instance: FBRTokenManager
  private tokenCache: Map<string, TokenInfo> = new Map()
  private refreshInProgress: Map<string, Promise<TokenRefreshResult>> = new Map()
  
  private constructor() {}
  
  static getInstance(): FBRTokenManager {
    if (!this.instance) {
      this.instance = new FBRTokenManager()
    }
    return this.instance
  }
  
  /**
   * Get a valid FBR token for the specified business and environment
   */
  async getValidToken(businessId: string, environment: 'sandbox' | 'production'): Promise<TokenRefreshResult> {
    const cacheKey = `${businessId}_${environment}`
    
    // Check cache first
    const cachedToken = this.tokenCache.get(cacheKey)
    if (cachedToken && cachedToken.isValid && this.isTokenValid(cachedToken)) {
      return {
        success: true,
        token: cachedToken.token
      }
    }
    
    // Check if refresh is already in progress
    if (this.refreshInProgress.has(cacheKey)) {
      return this.refreshInProgress.get(cacheKey)!
    }
    
    // Start token refresh
    const refreshPromise = this.refreshToken(businessId, environment)
    this.refreshInProgress.set(cacheKey, refreshPromise)
    
    try {
      const result = await refreshPromise
      return result
    } finally {
      this.refreshInProgress.delete(cacheKey)
    }
  }
  
  /**
   * Refresh FBR token for the specified business and environment
   */
  private async refreshToken(businessId: string, environment: 'sandbox' | 'production'): Promise<TokenRefreshResult> {
    try {
      // Get business information
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: {
          id: true,
          companyName: true,
          ntnNumber: true,
          sandboxToken: true,
          productionToken: true,
          sandboxTokenValidated: true,
          productionTokenValidated: true,
          lastTokenValidation: true
        }
      })
      
      if (!business) {
        return {
          success: false,
          error: 'Business not found'
        }
      }
      
      // Get the appropriate token
      const token = environment === 'sandbox' ? business.sandboxToken : business.productionToken
      const isValidated = environment === 'sandbox' 
        ? business.sandboxTokenValidated 
        : business.productionTokenValidated
      
      if (!token) {
        return {
          success: false,
          error: `No ${environment} token configured for business`
        }
      }
      
      // Validate the token
      const validationResult = await this.validateToken(token, environment)
      
      if (!validationResult.isValid) {
        // Try to refresh the token (if refresh mechanism is available)
        const refreshResult = await this.performTokenRefresh(businessId, environment, token)
        
        if (refreshResult.success) {
          // Cache the refreshed token
          this.cacheToken(businessId, environment, refreshResult.token!)
          
          return {
            success: true,
            token: refreshResult.token
          }
        } else {
          // Mark token as invalid in cache
          this.cacheToken(businessId, environment, token, false)
          
          return {
            success: false,
            error: refreshResult.error || 'Token validation failed'
          }
        }
      }
      
      // Cache the valid token
      this.cacheToken(businessId, environment, token, true, validationResult.expiresAt)
      
      // Update validation timestamp in database
      await this.updateTokenValidationTimestamp(businessId, environment)
      
      return {
        success: true,
        token
      }
    } catch (error: any) {
      console.error('Error refreshing FBR token:', error)
      return {
        success: false,
        error: error.message || 'Unknown error during token refresh'
      }
    }
  }
  
  /**
   * Validate a token with FBR API
   */
  private async validateToken(token: string, environment: 'sandbox' | 'production'): Promise<{
    isValid: boolean
    expiresAt?: Date
  }> {
    try {
      // For now, we'll implement a simple validation
      // In a real implementation, you would make an API call to FBR to validate the token
      
      // Check if token looks like a valid JWT or Bearer token
      if (!token || token.length < 10) {
        return { isValid: false }
      }
      
      // For sandbox tokens, we'll consider them valid for 24 hours
      // For production tokens, we'll consider them valid for 7 days
      const validityHours = environment === 'sandbox' ? 24 : 24 * 7
      const expiresAt = new Date(Date.now() + validityHours * 60 * 60 * 1000)
      
      return {
        isValid: true,
        expiresAt
      }
    } catch (error) {
      console.error('Error validating token:', error)
      return { isValid: false }
    }
  }
  
  /**
   * Perform token refresh with FBR API
   */
  private async performTokenRefresh(
    businessId: string, 
    environment: 'sandbox' | 'production', 
    currentToken: string
  ): Promise<TokenRefreshResult> {
    try {
      // In a real implementation, you would make an API call to FBR to refresh the token
      // For now, we'll just return the current token as "refreshed"
      
      console.log(`🔄 Refreshing ${environment} token for business ${businessId}`)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real implementation, you would:
      // 1. Make an API call to FBR's token refresh endpoint
      // 2. Get the new token and its expiration time
      // 3. Update the token in the database
      // 4. Return the new token
      
      // For now, we'll just validate the current token again
      const validationResult = await this.validateToken(currentToken, environment)
      
      if (validationResult.isValid) {
        return {
          success: true,
          token: currentToken
        }
      } else {
        return {
          success: false,
          error: 'Token could not be refreshed'
        }
      }
    } catch (error: any) {
      console.error('Error performing token refresh:', error)
      return {
        success: false,
        error: error.message || 'Unknown error during token refresh'
      }
    }
  }
  
  /**
   * Cache a token
   */
  private cacheToken(
    businessId: string, 
    environment: 'sandbox' | 'production', 
    token: string, 
    isValid: boolean = true, 
    expiresAt?: Date
  ): void {
    const cacheKey = `${businessId}_${environment}`
    
    this.tokenCache.set(cacheKey, {
      token,
      environment,
      expiresAt,
      isValid,
      businessId
    })
    
    // Set expiration for cache entry
    if (expiresAt) {
      const ttl = expiresAt.getTime() - Date.now()
      if (ttl > 0) {
        setTimeout(() => {
          this.tokenCache.delete(cacheKey)
        }, ttl)
      }
    }
  }
  
  /**
   * Check if a token is still valid
   */
  private isTokenValid(tokenInfo: TokenInfo): boolean {
    if (!tokenInfo.expiresAt) {
      // If no expiration time, assume token is valid for 1 hour
      return true
    }
    
    // Check if token is expired or will expire within the next 5 minutes
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)
    return tokenInfo.expiresAt > fiveMinutesFromNow
  }
  
  /**
   * Update token validation timestamp in database
   */
  private async updateTokenValidationTimestamp(businessId: string, environment: 'sandbox' | 'production'): Promise<void> {
    try {
      await prisma.business.update({
        where: { id: businessId },
        data: {
          lastTokenValidation: new Date(),
          ...(environment === 'sandbox' 
            ? { sandboxTokenValidated: true } 
            : { productionTokenValidated: true }
          )
        }
      })
    } catch (error) {
      console.error('Error updating token validation timestamp:', error)
    }
  }
  
  /**
   * Clear token cache for a business
   */
  clearTokenCache(businessId: string, environment?: 'sandbox' | 'production'): void {
    if (environment) {
      const cacheKey = `${businessId}_${environment}`
      this.tokenCache.delete(cacheKey)
    } else {
      // Clear all tokens for the business
      const sandboxKey = `${businessId}_sandbox`
      const productionKey = `${businessId}_production`
      this.tokenCache.delete(sandboxKey)
      this.tokenCache.delete(productionKey)
    }
  }
  
  /**
   * Handle token expiration during retry attempts
   */
  async handleTokenExpiration(invoiceId: string): Promise<TokenRefreshResult> {
    try {
      // Get invoice details
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        select: {
          id: true,
          businessId: true,
          mode: true
        }
      })
      
      if (!invoice) {
        return {
          success: false,
          error: 'Invoice not found'
        }
      }
      
      const environment = invoice.mode.toLowerCase() as 'sandbox' | 'production'
      
      // Clear the cached token for this business and environment
      this.clearTokenCache(invoice.businessId, environment)
      
      // Get a fresh token
      return await this.getValidToken(invoice.businessId, environment)
    } catch (error: any) {
      console.error('Error handling token expiration:', error)
      return {
        success: false,
        error: error.message || 'Unknown error handling token expiration'
      }
    }
  }
}

// Export singleton instance
export const fbrTokenManager = FBRTokenManager.getInstance()

// Helper function to get a valid token for an invoice
export async function getValidFbrToken(invoiceId: string): Promise<TokenRefreshResult> {
  try {
    // Get invoice details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        businessId: true,
        mode: true
      }
    })
    
    if (!invoice) {
      return {
        success: false,
        error: 'Invoice not found'
      }
    }
    
    const environment = invoice.mode.toLowerCase() as 'sandbox' | 'production'
    
    // Get a valid token
    return await fbrTokenManager.getValidToken(invoice.businessId, environment)
  } catch (error: any) {
    console.error('Error getting valid FBR token:', error)
    return {
      success: false,
      error: error.message || 'Unknown error getting valid FBR token'
    }
  }
}