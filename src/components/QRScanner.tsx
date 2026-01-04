import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "./ui/button";

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<AbortController | null>(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
  }, []);

  const startScanning = async () => {
    if (!videoRef.current || !codeReaderRef.current) return;

    try {
      setError(null);
      setIsScanning(true);
      controlsRef.current = new AbortController();

      await codeReaderRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err) => {
          if (result) {
            onScan(result.getText());
            stopScanning();
          }
          if (err) {
            setError(err.message);
            onError?.(err);
          }
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      onError?.(error);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    controlsRef.current?.abort();
    setIsScanning(false);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-auto"
          style={{ display: isScanning ? "block" : "none" }}
        />
        {!isScanning && (
          <div className="w-full h-64 flex items-center justify-center text-gray-400">
            Camera will appear here
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isScanning ? (
          <Button onClick={startScanning} className="flex-1">
            Start Scanning
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="destructive" className="flex-1">
            Stop Scanning
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
