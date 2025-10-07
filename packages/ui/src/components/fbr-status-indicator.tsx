import * as React from "react"
import { Badge } from "./badge"
import { cn } from "../lib/utils"

interface FBRStatus {
  environment: 'LOCAL' | 'SANDBOX' | 'PRODUCTION'
  isConnected: boolean
  lastSync?: Date
  tokenValidated?: boolean
}

interface FBRStatusIndicatorProps {
  status: FBRStatus
  className?: string
  showDetails?: boolean
}

const FBRStatusIndicator = React.forwardRef<HTMLDivElement, FBRStatusIndicatorProps>(
  ({ status, className, showDetails = false }, ref) => {
    const getStatusColor = () => {
      if (!status.isConnected) return "destructive"
      if (status.environment === 'PRODUCTION') return "default"
      if (status.environment === 'SANDBOX') return "secondary"
      return "outline"
    }

    const getStatusText = () => {
      if (!status.isConnected) return "Disconnected"
      if (status.environment === 'PRODUCTION') return "Production"
      if (status.environment === 'SANDBOX') return "Sandbox"
      return "Local"
    }

    const getStatusIcon = () => {
      if (!status.isConnected) return "❌"
      if (status.tokenValidated) return "✅"
      return "⚠️"
    }

    return (
      <div ref={ref} className={cn("flex items-center gap-2", className)}>
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          <span>{getStatusIcon()}</span>
          <span>{getStatusText()}</span>
        </Badge>
        
        {showDetails && (
          <div className="text-xs text-muted-foreground">
            {status.lastSync && (
              <div>Last sync: {status.lastSync.toLocaleString()}</div>
            )}
            {status.tokenValidated && (
              <div className="text-green-600">Token validated</div>
            )}
          </div>
        )}
      </div>
    )
  }
)

FBRStatusIndicator.displayName = "FBRStatusIndicator"

export { FBRStatusIndicator }