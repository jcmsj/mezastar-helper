import { useState, useRef } from 'react'
import { db } from '@/data/dexie'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { QRScanner } from './QRScanner'
import { Upload, AlertCircle } from 'lucide-react'
import { BrowserMultiFormatReader } from '@zxing/browser'

interface AddTrainerFormProps {
  onSuccess: () => void
  onOpenChange: (open: boolean) => void
}

export function AddTrainerForm({ onSuccess, onOpenChange }: AddTrainerFormProps) {
  const [step, setStep] = useState<'method' | 'manual' | 'qr' | 'upload'>('method')
  const [trainerId, setTrainerId] = useState('')
  const [alias, setAlias] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  const handleAddTrainer = async (id: string, aliasName: string) => {
    if (!id.trim() || !aliasName.trim()) {
      setError('Both trainer ID and alias are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Check if ID already exists
      const existing = await db.trainerIds
        .where('trainerId')
        .equals(id.trim())
        .first()

      if (existing) {
        setError('This trainer ID already exists')
        setLoading(false)
        return
      }

      await db.trainerIds.add({
        trainerId: id.trim(),
        alias: aliasName.trim(),
        createdAt: Date.now(),
      })

      setTrainerId('')
      setAlias('')
      setError(null)
      setStep('method')
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError('Failed to add trainer ID')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleQRScan = (result: string) => {
    // parse as url
    try {
      const url = new URL(result)
      // get `s` param
      const sParam = url.searchParams.get('s')
      if (!sParam) {
        setError('Invalid QR code format')
        return
      }
      setTrainerId(sParam)
      setStep('manual')
    } catch {
      setError('Invalid QR code format')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      setError(null)
      setUploadProgress('Reading file...')

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const imageData = e.target?.result as string
          setUploadProgress('Scanning for QR code...')

          // Create image element to decode
          const img = new Image()
          img.onload = async () => {
            try {
              const codeReader = new BrowserMultiFormatReader()
              const result = await codeReader.decodeFromImageElement(img)

              if (result) {
                const qrText = result.getText()
                handleQRScan(qrText)
                setUploadProgress(null)
                setLoading(false)
              }
            } catch (err) {
              setError('No QR code found in the uploaded image')
              setUploadProgress(null)
              setLoading(false)
            }
          }
          img.src = imageData
        } catch (err) {
          setError('Failed to process image')
          setUploadProgress(null)
          setLoading(false)
          console.error(err)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to read file')
      setUploadProgress(null)
      setLoading(false)
      console.error(err)
    }
  }

  if (step === 'method') {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <Button
            onClick={() => setStep('qr')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Scan QR Code
          </Button>
          <Button
            onClick={() => setStep('upload')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <Button
            onClick={() => setStep('manual')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Enter Manually
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'qr') {
    return (
      <div className="space-y-4">
        <QRScanner onScan={handleQRScan} />
        <Button
          onClick={() => setStep('method')}
          variant="outline"
          className="w-full"
        >
          Back
        </Button>
      </div>
    )
  }

  if (step === 'upload') {
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Upload image with QR code
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PNG, JPG, or GIF up to 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={loading}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            size="sm"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Select Image'}
          </Button>
        </div>

        {uploadProgress && (
          <div className="p-3 bg-blue-50 text-blue-700 rounded border border-blue-200 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {uploadProgress}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={() => setStep('method')}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="trainer-id">Trainer ID</Label>
        <Input
          id="trainer-id"
          value={trainerId}
          onChange={(e) => setTrainerId(e.target.value)}
          placeholder="Enter your trainer ID"
          className="mt-1"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="alias">Alias (Display Name)</Label>
        <Input
          id="alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="e.g., My Main, Alt Account"
          className="mt-1"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => setStep('method')}
          variant="outline"
          className="flex-1"
          disabled={loading}
        >
          Back
        </Button>
        <Button
          onClick={() => handleAddTrainer(trainerId, alias)}
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </div>
    </div>
  )
}
