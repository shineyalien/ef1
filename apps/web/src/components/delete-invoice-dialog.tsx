"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react"

interface DeleteInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  invoiceNumber: string
  status: string
  isDeleting?: boolean
}

export function DeleteInvoiceDialog({
  open,
  onOpenChange,
  onConfirm,
  invoiceNumber,
  status,
  isDeleting = false
}: DeleteInvoiceDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2 pt-4">
            <p>
              Are you sure you want to delete invoice{" "}
              <span className="font-semibold text-gray-900">{invoiceNumber}</span>?
            </p>
            <p className="text-sm">
              Status: <span className="font-medium">{status}</span>
            </p>
            <p className="text-sm text-red-600 font-medium">
              This action cannot be undone. The invoice and all its items will be permanently deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete Invoice"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
