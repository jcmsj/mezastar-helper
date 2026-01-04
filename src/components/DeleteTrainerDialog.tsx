import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { AlertTriangle } from 'lucide-react'

interface DeleteTrainerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trainerId: string
  alias: string
  onConfirm: () => Promise<void>
}

export function DeleteTrainerDialog({
  open,
  onOpenChange,
  trainerId,
  alias,
  onConfirm,
}: DeleteTrainerDialogProps) {
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isMobile = useIsMobile()

  const handleConfirm = async () => {
    if (confirmText.trim() !== alias) {
      setError(`Please enter "${alias}" to confirm deletion`)
      return
    }

    try {
      setLoading(true)
      setError(null)
      await onConfirm()
      setConfirmText('')
      onOpenChange(false)
    } catch (err) {
      setError('Failed to delete trainer ID')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setConfirmText('')
    setError(null)
    setLoading(false)
    onOpenChange(newOpen)
  }

  const Content = () => (
    <div className="space-y-4">
      <div className="flex gap-3 items-start p-3 bg-red-50 rounded border border-red-200">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-800">
          <p className="font-semibold mb-1">This action cannot be undone</p>
          <p>You are about to permanently delete this trainer ID and all associated data.</p>
        </div>
      </div>

      <div>
        <Label htmlFor="confirm-alias" className="text-base font-semibold">
          Type the trainer alias to confirm:
        </Label>
        <p className="text-sm text-gray-600 mt-1 mb-2">Enter: <span className="font-mono font-bold">{alias}</span></p>
        <Input
          id="confirm-alias"
          value={confirmText}
          onChange={(e) => {
            setConfirmText(e.target.value)
            setError(null)
          }}
          placeholder={alias}
          className="mt-1"
          disabled={loading}
          autoFocus
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => handleOpenChange(false)}
          variant="outline"
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="destructive"
          className="flex-1"
          disabled={loading || confirmText.trim() !== alias}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-red-600">Delete Trainer ID?</DrawerTitle>
            <DrawerDescription>
              {trainerId.slice(0, 16)}...
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Trainer ID?</DialogTitle>
          <DialogDescription>
            {trainerId.slice(0, 16)}...
          </DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  )
}
