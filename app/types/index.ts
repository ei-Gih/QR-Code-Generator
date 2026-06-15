// ============================================================
// Types centralizados do QR Code Generator
// ============================================================

/** Modos de geração disponíveis */
export type QRMode = 'text' | 'wifi' | 'pix' | 'scanner';

/** Tipos de segurança Wi-Fi */
export type WifiSecurity = 'WPA' | 'WPA2' | 'WEP' | 'nopass';

/** Item salvo no histórico */
export interface HistoryItem {
  id: string;
  content: string;
  label: string;
  mode: QRMode;
  fgColor: string;
  bgColor: string;
  createdAt: number;
}

/** Configurações de cor do QR */
export interface QRColors {
  fg: string;
  bg: string;
}

/** Dados do formulário Wi-Fi */
export interface WifiData {
  ssid: string;
  password: string;
  security: WifiSecurity;
}

/** Dados do formulário PIX */
export interface PixData {
  name: string;
  city: string;
  key: string;
  value: string;
  description: string;
}

/** Tamanho do logo central */
export type LogoSize = 24 | 38 | 50;
