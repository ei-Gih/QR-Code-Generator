'use client';
// ============================================================
// components/QRPreview.tsx — renderiza e exporta o QR Code
// ============================================================

import { useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import type { LogoSize } from '../types';
import { downloadCanvasAsPng, downloadSVG } from '../lib/utils';

interface QRPreviewProps {
  content: string;
  fgColor: string;
  bgColor: string;
  logoDataUrl: string | null;
  logoSize: LogoSize;
}

const QR_SIZE = 256; // tamanho canvas em px

export default function QRPreview({
  content,
  fgColor,
  bgColor,
  logoDataUrl,
  logoSize,
}: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Renderiza QR no canvas ──────────────────────────────
  const renderQR = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!content.trim()) {
      ctx.clearRect(0, 0, QR_SIZE, QR_SIZE);
      // Placeholder vazio com borda pontilhada (desenhado via CSS)
      return;
    }

    // Gera QR no canvas com nível de correção H (suporta logo)
    await QRCode.toCanvas(canvas, content, {
      width: QR_SIZE,
      margin: 1,
      errorCorrectionLevel: logoDataUrl ? 'H' : 'M',
      color: { dark: fgColor, light: bgColor },
    });

    // Insere logo no centro
    if (logoDataUrl) {
      const img = new Image();
      img.src = logoDataUrl;
      await new Promise<void>((res) => {
        img.onload = () => {
          const half = logoSize / 2;
          const cx = QR_SIZE / 2 - half;
          const cy = QR_SIZE / 2 - half;
          // Fundo branco para destacar a logo
          const pad = 4;
          ctx.fillStyle = bgColor;
          ctx.fillRect(cx - pad, cy - pad, logoSize + pad * 2, logoSize + pad * 2);
          ctx.drawImage(img, cx, cy, logoSize, logoSize);
          res();
        };
        img.onerror = () => res();
      });
    }
  }, [content, fgColor, bgColor, logoDataUrl, logoSize]);

  useEffect(() => {
    renderQR();
  }, [renderQR]);

  // ── Download PNG ──────────────────────────────────────
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !content) return;
    downloadCanvasAsPng(canvas, 'qrcode.png');
  };

  // ── Download SVG ──────────────────────────────────────
  const handleDownloadSvg = async () => {
    if (!content) return;
    const svgStr = await QRCode.toString(content, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: logoDataUrl ? 'H' : 'M',
      color: { dark: fgColor, light: bgColor },
    });
    // Parseia a string SVG em um elemento DOM para o download
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStr, 'image/svg+xml');
    const svgEl = doc.querySelector('svg') as SVGElement | null;
    if (!svgEl) return;
    downloadSVG(svgEl, 'qrcode.svg');
  };

  const isEmpty = !content.trim();

  return (
    <div className="qr-preview">
      <div
        className={`qr-preview__canvas-wrapper ${isEmpty ? 'qr-preview__canvas-wrapper--empty' : ''}`}
        aria-label={isEmpty ? 'Área de preview do QR Code — aguardando conteúdo' : 'Preview do QR Code'}
        role="img"
      >
        <canvas
          ref={canvasRef}
          width={QR_SIZE}
          height={QR_SIZE}
          className="qr-preview__canvas"
          aria-hidden="true"
        />
        {isEmpty && (
          <div className="qr-preview__placeholder" aria-hidden="true">
            <span className="qr-preview__placeholder-icon">⬛</span>
            <p>Digite algo para gerar</p>
          </div>
        )}
      </div>

      <div className="qr-preview__actions">
        <button
          className="btn btn--primary"
          onClick={handleDownloadPng}
          disabled={isEmpty}
          aria-label="Baixar QR Code como PNG"
        >
          ⬇ PNG
        </button>
        <button
          className="btn btn--secondary"
          onClick={handleDownloadSvg}
          disabled={isEmpty}
          aria-label="Baixar QR Code como SVG"
        >
          ⬇ SVG
        </button>
      </div>
    </div>
  );
}
