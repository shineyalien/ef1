'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"

interface FBRSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: any
  onSubmit: (environment: string) => void
}

export function FBRSubmissionModal({ isOpen, onClose, invoice, onSubmit }: FBRSubmissionModalProps) {
  const [environment, setEnvironment] = useState<string>('sandbox')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(environment)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Invoice to FBR</DialogTitle>
          <DialogDescription>
            Choose the environment to submit this invoice to the FBR system
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Invoice Details:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Customer:</strong> {invoice.customerName}</p>
              <p><strong>Amount:</strong> PKR {invoice.totalAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Environment:</Label>
            <RadioGroup value={environment} onValueChange={setEnvironment}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sandbox" id="sandbox" />
                <Label htmlFor="sandbox" className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                  Sandbox (Testing)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="production" id="production" />
                <Label htmlFor="production" className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Production (Live)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {environment === 'production' && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This will submit the invoice to the live FBR system. 
                Make sure all invoice details are correct before proceeding.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={environment === 'production' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              `Submit to ${environment === 'production' ? 'Production' : 'Sandbox'}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}