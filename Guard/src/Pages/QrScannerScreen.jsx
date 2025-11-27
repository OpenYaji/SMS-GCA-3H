import React, { useState, useEffect, useCallback, useRef } from 'react';
import jsQR from 'jsqr';
import Card from '../Components/Card.jsx';

const QrScannerScreen = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setDetected(null);
    setCopied(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
    } catch (err) {
      setError('Camera access denied or unavailable: ' + (err.message || err.name));
      setScanning(false);
    }
  }, []);

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    if (w === 0 || h === 0) return null;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    try {
      ctx.drawImage(video, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
      if (code && code.data) {
        return code.data;
      }
    } catch (err) {
      console.warn('scanFrame error', err);
    }
    return null;
  }, []);

  useEffect(() => {
    let mounted = true;

    const loop = async () => {
      if (!mounted) return;
      if (!scanning) return;
      try {
        const result = scanFrame();
        if (result) {
          setDetected(result);
          setScanning(false);
          stopCamera();
          try {
            await navigator.clipboard?.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (_) {}
          return;
        }
      } catch (err) {
        console.error('QR scan loop error', err);
        setError(String(err));
        setScanning(false);
        stopCamera();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    if (scanning) {
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scanning, scanFrame, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="p-4 sm:p-0">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900">QR Code Scanner</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-lg bg-black rounded-lg overflow-hidden relative">
              <video ref={videoRef} className="w-full h-64 object-cover bg-black" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-3 left-3 bg-amber-400 text-stone-900 px-3 py-1 rounded-md text-sm">
                {scanning ? 'Scanning...' : detected ? 'Detected' : 'No QR Detected!'}
              </div>
              {copied && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-md text-sm">Copied!</div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div style={{ width: '60%', height: '40%', border: '2px dashed rgba(255,209,102,0.9)', borderRadius: 12 }} />
              </div>
            </div>

            <div className="mt-3 flex space-x-2">
              {scanning ? (
                <button className="px-4 py-2 rounded-md bg-gray-500 text-white" onClick={() => { setScanning(false); stopCamera(); }}>Disabled</button>
              ) : (
                <button className="px-4 py-2 rounded-md bg-green-400 text-stone-900" onClick={() => startCamera()}>Enable</button>
              )}
              <button
                className="px-4 py-2 rounded-md bg-stone-200 text-stone-800"
                onClick={() => { if (detected) navigator.clipboard?.writeText(detected); }}
                disabled={!detected}
              >
                Copy Result
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <Card title="Result">
              <div className="min-h-[150px]">
                {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
                {!error && detected && (
                  <div className="break-words text-stone-800 font-medium">{detected}</div>
                )}
                {!error && !detected && (
                  <div className="text-sm text-stone-500">
                    No QR detected yet. Allow camera and press Start. jsQR decodes frames from the webcam when BarcodeDetector is not available.
                  </div>
                )}
              </div>
            </Card>

            <div className="mt-4">
              <Card title="Tips">
                <ul className="list-disc list-inside text-sm text-stone-600">
                  <li>Allow camera access when prompted.</li>
                  <li>Point camera steadily at the QR code (good lighting helps).</li>
                  <li>If detection fails try moving closer/farther or use a browser that supports BarcodeDetector (Chrome/Edge).</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrScannerScreen;
