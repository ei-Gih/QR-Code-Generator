'use client';
// ============================================================
// components/TabNav.tsx — navegação entre modos do gerador
// ============================================================

import type { QRMode } from '../types';

interface Tab {
  id: QRMode;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'text',    label: 'Texto / URL', icon: '🔗' },
  { id: 'wifi',    label: 'Wi-Fi',       icon: '📶' },
  { id: 'pix',     label: 'PIX',         icon: '💰' },
  { id: 'scanner', label: 'Scanner',     icon: '📷' },
];

interface TabNavProps {
  active: QRMode;
  onChange: (mode: QRMode) => void;
}

export default function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="tab-nav" role="tablist" aria-label="Modos do gerador">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          aria-controls={`panel-${tab.id}`}
          className={`tab-btn ${active === tab.id ? 'tab-btn--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
