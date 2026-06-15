'use client';
// ============================================================
// components/QRHistory.tsx — histórico dos últimos QR codes
// ============================================================

import type { HistoryItem } from '../types';
import { formatDate, truncate } from '../lib/utils';

interface QRHistoryProps {
  history: HistoryItem[];
  onReuse: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const MODE_LABEL: Record<string, string> = {
  text: 'Texto',
  wifi: 'Wi-Fi',
  pix: 'PIX',
  scanner: 'Scanner',
};

export default function QRHistory({
  history,
  onReuse,
  onRemove,
  onClear,
}: QRHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="history history--empty">
        <span className="history__empty-icon" aria-hidden="true">🕐</span>
        <p>Nenhum QR gerado ainda.</p>
        <p className="history__empty-sub">Os últimos 10 aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <section className="history" aria-label="Histórico de QR codes">
      <div className="history__header">
        <h2 className="history__title">Histórico</h2>
        <button
          className="btn btn--ghost btn--sm"
          onClick={onClear}
          aria-label="Limpar todo o histórico"
        >
          Limpar tudo
        </button>
      </div>

      <ul className="history__list" role="list">
        {history.map((item) => (
          <li key={item.id} className="history__item">
            {/* Amostra de cor */}
            <span
              className="history__swatch"
              style={{ background: item.fgColor }}
              aria-hidden="true"
            />

            <div className="history__info">
              <span className="history__mode">{MODE_LABEL[item.mode] ?? item.mode}</span>
              <span className="history__content">{truncate(item.label || item.content)}</span>
              <span className="history__date">{formatDate(item.createdAt)}</span>
            </div>

            <div className="history__actions">
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => onReuse(item)}
                aria-label={`Reutilizar: ${item.label || item.content}`}
              >
                Usar
              </button>
              <button
                className="btn btn--danger btn--sm"
                onClick={() => onRemove(item.id)}
                aria-label={`Remover do histórico: ${item.label || item.content}`}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
