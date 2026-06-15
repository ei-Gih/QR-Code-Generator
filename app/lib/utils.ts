// ============================================================
// lib/utils.ts — utilitários puros sem side effects
// ============================================================

import type { PixData, WifiData, HistoryItem, QRMode, QRColors } from '../types';

// ── PIX ──────────────────────────────────────────────────────

/**
 * Calcula o CRC16-CCITT (polinômio 0x1021) para payload PIX
 */
function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

/** Formata um campo EMV: ID + tamanho (2 dígitos) + valor */
function emvField(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`;
}

/**
 * Gera payload PIX (EMV QR Code) válido para leitura por apps bancários.
 * Spec: https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf
 */
export function buildPixPayload(data: PixData): string {
  const { name, city, key, value, description } = data;

  // Merchant Account Information (ID 26)
  const gui = emvField('00', 'BR.GOV.BCB.PIX');
  const keyField = emvField('01', key.trim());
  const descField = description ? emvField('02', description.slice(0, 72)) : '';
  const merchantInfo = emvField('26', gui + keyField + descField);

  // Transaction Amount (ID 54) — apenas se preenchido
  const amountField = value && parseFloat(value) > 0
    ? emvField('54', parseFloat(value).toFixed(2))
    : '';

  // Additional Data (ID 62) — txid obrigatório
  const additionalData = emvField('62', emvField('05', '***'));

  // Monta payload sem CRC
  const payload =
    emvField('00', '01') +           // Payload Format Indicator
    emvField('01', '12') +           // Point of Initiation Method (estático)
    merchantInfo +
    emvField('52', '0000') +         // Merchant Category Code
    emvField('53', '986') +          // Transaction Currency (BRL)
    amountField +
    emvField('58', 'BR') +           // Country Code
    emvField('59', name.slice(0, 25)) +
    emvField('60', city.slice(0, 15)) +
    additionalData +
    '6304';                          // CRC placeholder

  return payload + crc16(payload);
}

// ── Wi-Fi ─────────────────────────────────────────────────────

/**
 * Gera string no padrão WIFI: para leitura por apps de câmera
 */
export function buildWifiString(data: WifiData): string {
  const escape = (s: string) => s.replace(/[\\;,"]/g, (c) => `\\${c}`);
  const { ssid, password, security } = data;
  return `WIFI:T:${security};S:${escape(ssid)};P:${escape(password)};;`;
}

// ── Histórico ────────────────────────────────────────────────

const HISTORY_KEY = 'qrgen_history_v2';
const MAX_HISTORY = 10;

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(
  content: string,
  label: string,
  mode: QRMode,
  colors: QRColors
): HistoryItem[] {
  const history = loadHistory();

  // Evita duplicatas consecutivas
  if (history[0]?.content === content) return history;

  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    content,
    label: label.slice(0, 60),
    mode,
    fgColor: colors.fg,
    bgColor: colors.bg,
    createdAt: Date.now(),
  };

  const updated = [newItem, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromHistory(id: string): HistoryItem[] {
  const updated = loadHistory().filter((item) => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// ── Tema ─────────────────────────────────────────────────────

const THEME_KEY = 'qrgen_theme';

export function loadTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: 'dark' | 'light'): void {
  localStorage.setItem(THEME_KEY, theme);
}

// ── Download ─────────────────────────────────────────────────

/**
 * Baixa o canvas como PNG com o nome especificado
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename = 'qrcode.png'): void {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  link.click();
}

/**
 * Baixa o SVG gerado como arquivo .svg
 */
export function downloadSVG(svgElement: SVGElement, filename = 'qrcode.svg'): void {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgElement);
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Formata data para exibição no histórico */
export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts));
}

/** Trunca string longa para exibição */
export function truncate(str: string, max = 40): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}
