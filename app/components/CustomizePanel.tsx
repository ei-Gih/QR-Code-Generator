'use client';
// ============================================================
// components/CustomizePanel.tsx — cores, logo e tamanho
// ============================================================

import { useRef, type ChangeEvent } from 'react';
import type { LogoSize } from '../types';

interface CustomizePanelProps {
  fgColor: string;
  bgColor: string;
  logoDataUrl: string | null;
  logoSize: LogoSize;
  onFgChange: (color: string) => void;
  onBgChange: (color: string) => void;
  onLogoChange: (dataUrl: string | null) => void;
  onLogoSizeChange: (size: LogoSize) => void;
}

const LOGO_SIZES: { value: LogoSize; label: string }[] = [
  { value: 24, label: '24px — Pequeno' },
  { value: 38, label: '38px — Médio' },
  { value: 50, label: '50px — Grande' },
];

export default function CustomizePanel({
  fgColor,
  bgColor,
  logoDataUrl,
  logoSize,
  onFgChange,
  onBgChange,
  onLogoChange,
  onLogoSizeChange,
}: CustomizePanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => onLogoChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="customize">
      {/* ── Cores ───────────────────────────────────── */}
      <div className="customize__section">
        <h3 className="customize__heading">Cores</h3>
        <div className="customize__colors">
          <label className="color-picker" htmlFor="fg-color">
            <span className="color-picker__preview" style={{ background: fgColor }} />
            <span className="color-picker__label">Cor do QR</span>
            <input
              id="fg-color"
              type="color"
              value={fgColor}
              onChange={(e) => onFgChange(e.target.value)}
              className="color-picker__input"
              aria-label="Cor do QR Code"
            />
          </label>

          <label className="color-picker" htmlFor="bg-color">
            <span
              className="color-picker__preview color-picker__preview--checkered"
              style={{ background: bgColor }}
            />
            <span className="color-picker__label">Cor de Fundo</span>
            <input
              id="bg-color"
              type="color"
              value={bgColor}
              onChange={(e) => onBgChange(e.target.value)}
              className="color-picker__input"
              aria-label="Cor de fundo do QR Code"
            />
          </label>
        </div>
      </div>

      {/* ── Logo ────────────────────────────────────── */}
      <div className="customize__section">
        <h3 className="customize__heading">Logo Central</h3>

        <div className="logo-upload">
          {logoDataUrl && (
            <div className="logo-upload__preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoDataUrl} alt="Logo selecionada" width={48} height={48} />
              <button
                className="btn btn--danger btn--sm"
                onClick={() => {
                  onLogoChange(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}
                aria-label="Remover logo"
              >
                Remover
              </button>
            </div>
          )}

          <button
            className="btn btn--ghost logo-upload__btn"
            onClick={() => fileRef.current?.click()}
          >
            {logoDataUrl ? '↩ Trocar Logo' : '+ Inserir Logo'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="sr-only"
            aria-label="Upload de logo para o QR Code"
          />
        </div>

        {logoDataUrl && (
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label htmlFor="logo-size" className="form-label">
              Tamanho da Logo
            </label>
            <select
              id="logo-size"
              className="form-select"
              value={logoSize}
              onChange={(e) => onLogoSizeChange(Number(e.target.value) as LogoSize)}
            >
              {LOGO_SIZES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {logoDataUrl && (
          <p className="form-hint">
            A logo cobre até ~30% do QR — dentro do limite de correção de erros.
          </p>
        )}
      </div>
    </div>
  );
}
