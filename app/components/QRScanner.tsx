'use client';
// ============================================================
// components/QRScanner.tsx — scanner via câmera (WebRTC + BarcodeDetector)
// ============================================================

import { useRef, useState, useCallback, useEffect } from 'react';

interface QRScannerProps {
  onResult: (text: string) => void;
}

export default function QRScanner({ onResult }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);

  const [active, setActive] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [supported, setSupported] = useState(true);

  // Verifica suporte da API
  useEffect(() => {
    if (!('BarcodeDetector' in window)) {
      setSupported(false);
    }
  }, []);

  const stopScanner = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  const startScanner = useCallback(async () => {
    setError('');
    setResult('');

    if (!supported) {
      setError(
        'Seu navegador não suporta leitura de QR via câmera. Tente Chrome ou Edge.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);

      // @ts-expect-error — BarcodeDetector ainda experimental
      const detector = new BarcodeDetector({ formats: ['qr_code'] });

      const scan = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          animRef.current = requestAnimationFrame(scan);
          return;
        }
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0) {
            const text = codes[0].rawValue as string;
            setResult(text);
            onResult(text);
            stopScanner();
            return;
          }
        } catch {
          // silencioso — pode falhar em frames pretos
        }
        animRef.current = requestAnimationFrame(scan);
      };

      animRef.current = requestAnimationFrame(scan);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Permissão de câmera negada. Permita o acesso nas configurações do navegador.');
      } else {
        setError('Não foi possível acessar a câmera.');
      }
    }
  }, [supported, onResult, stopScanner]);

  // Limpa ao desmontar
  useEffect(() => () => stopScanner(), [stopScanner]);

  return (
    <div className="scanner">
      <div className={`scanner__viewport ${active ? 'scanner__viewport--active' : ''}`}>
        <video
          ref={videoRef}
          className="scanner__video"
          muted
          playsInline
          aria-label="Câmera para leitura de QR Code"
        />
        {active && (
          <div className="scanner__overlay" aria-hidden="true">
            <div className="scanner__frame">
              <span /><span /><span /><span />
            </div>
            <p className="scanner__hint">Aponte para o QR Code</p>
          </div>
        )}
        {!active && !result && (
          <div className="scanner__placeholder">
            <span className="scanner__icon" aria-hidden="true">📷</span>
            <p>Câmera inativa</p>
          </div>
        )}
      </div>

      <div className="scanner__controls">
        {!active ? (
          <button
            className="btn btn--primary"
            onClick={startScanner}
            disabled={!supported}
          >
            Iniciar Scanner
          </button>
        ) : (
          <button className="btn btn--ghost" onClick={stopScanner}>
            Parar Scanner
          </button>
        )}
      </div>

      {error && (
        <p className="scanner__error" role="alert">
          ⚠ {error}
        </p>
      )}

      {result && (
        <div className="scanner__result" role="status">
          <p className="scanner__result-label">QR detectado:</p>
          <p className="scanner__result-text">{result}</p>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => {
              navigator.clipboard?.writeText(result);
            }}
          >
            Copiar
          </button>
        </div>
      )}

      {!supported && (
        <p className="scanner__unsupported">
          BarcodeDetector API não suportada neste navegador.{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector#browser_compatibility"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver compatibilidade
          </a>
        </p>
      )}
    </div>
  );
}
