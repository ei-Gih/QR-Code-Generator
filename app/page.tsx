'use client';
// ============================================================
// app/page.tsx — página principal do QR Code Generator
// ============================================================

import { useState, useCallback } from 'react';
import type { QRMode, HistoryItem, LogoSize } from './types';

import TabNav from './components/TabNav';
import QRPreview from './components/QRPreview';
import WifiForm from './components/WifiForm';
import PixForm from './components/PixForm';
import QRScanner from './components/QRScanner';
import CustomizePanel from './components/CustomizePanel';
import QRHistory from './components/QRHistory';
import InstallPWA from './components/InstallPWA';

import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';

export default function Home() {
  // ── Tema ──────────────────────────────────────────────
  const { theme, toggleTheme } = useTheme();

  // ── Modo / conteúdo ───────────────────────────────────
  const [mode, setMode] = useState<QRMode>('text');
  const [textInput, setTextInput] = useState('');
  const [wifiContent, setWifiContent] = useState('');
  const [pixContent, setPixContent] = useState('');

  // ── Customização ──────────────────────────────────────
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<LogoSize>(38);

  // ── Histórico ─────────────────────────────────────────
  const { history, addToHistory, removeItem, clearAll } = useHistory();

  // ── Resolve o conteúdo ativo ──────────────────────────
  const activeContent =
    mode === 'text' ? textInput :
    mode === 'wifi' ? wifiContent :
    mode === 'pix'  ? pixContent :
    ''; // scanner não gera QR

  // Salva no histórico quando o conteúdo está pronto
  const handleGenerate = useCallback(() => {
    if (!activeContent.trim()) return;
    addToHistory(activeContent, textInput || activeContent, mode, {
      fg: fgColor,
      bg: bgColor,
    });
  }, [activeContent, textInput, mode, fgColor, bgColor, addToHistory]);

  // Reutiliza item do histórico
  const handleReuse = useCallback((item: HistoryItem) => {
    setMode(item.mode === 'scanner' ? 'text' : item.mode);
    setTextInput(item.content);
    setFgColor(item.fgColor);
    setBgColor(item.bgColor);
  }, []);

  // Resultado do scanner → preenche aba de texto
  const handleScanResult = useCallback((text: string) => {
    setTextInput(text);
    setMode('text');
  }, []);

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <span className="header__logo" aria-hidden="true">⬛</span>
            <span className="header__name">QR Generator</span>
          </div>

          <div className="header__actions">
            <InstallPWA />
            <button
              className="btn btn--icon"
              onClick={toggleTheme}
              aria-label={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
              title={`Tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero__title">
          Gere QR Codes<br />
          <span className="hero__accent">para qualquer coisa</span>
        </h1>
        <p className="hero__subtitle">
          Texto, URL, Wi-Fi, PIX — personalize e baixe em PNG ou SVG.
        </p>
      </section>

      {/* ── App Principal ──────────────────────────────── */}
      <main className="main" id="main-content">
        <div className="workspace">

          {/* Coluna esquerda — inputs */}
          <div className="workspace__input">
            <TabNav active={mode} onChange={setMode} />

            {/* Painel Texto/URL */}
            <div
              id="panel-text"
              role="tabpanel"
              aria-labelledby="tab-text"
              hidden={mode !== 'text'}
              className="panel"
            >
              <div className="form-group">
                <label htmlFor="text-input" className="form-label">
                  URL ou Texto
                </label>
                <textarea
                  id="text-input"
                  className="form-textarea"
                  placeholder="https://exemplo.com ou qualquer texto…"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={3}
                  aria-describedby="text-hint"
                />
                <span id="text-hint" className="form-hint">
                  Suporta URLs, emails, telefones, texto livre e mais.
                </span>
              </div>
            </div>

            {/* Painel Wi-Fi */}
            <div
              id="panel-wifi"
              role="tabpanel"
              aria-labelledby="tab-wifi"
              hidden={mode !== 'wifi'}
              className="panel"
            >
              <WifiForm onChange={setWifiContent} />
            </div>

            {/* Painel PIX */}
            <div
              id="panel-pix"
              role="tabpanel"
              aria-labelledby="tab-pix"
              hidden={mode !== 'pix'}
              className="panel"
            >
              <PixForm onChange={setPixContent} />
            </div>

            {/* Painel Scanner */}
            <div
              id="panel-scanner"
              role="tabpanel"
              aria-labelledby="tab-scanner"
              hidden={mode !== 'scanner'}
              className="panel"
            >
              <QRScanner onResult={handleScanResult} />
            </div>

            {/* Personalização — sempre visível (exceto no scanner) */}
            {mode !== 'scanner' && (
              <CustomizePanel
                fgColor={fgColor}
                bgColor={bgColor}
                logoDataUrl={logoDataUrl}
                logoSize={logoSize}
                onFgChange={setFgColor}
                onBgChange={setBgColor}
                onLogoChange={setLogoDataUrl}
                onLogoSizeChange={setLogoSize}
              />
            )}

            {/* Botão Gerar (salva no histórico) */}
            {mode !== 'scanner' && (
              <button
                className="btn btn--primary btn--full"
                onClick={handleGenerate}
                disabled={!activeContent.trim()}
              >
                Salvar no Histórico
              </button>
            )}
          </div>

          {/* Coluna direita — preview + histórico */}
          <div className="workspace__output">
            <QRPreview
              content={activeContent}
              fgColor={fgColor}
              bgColor={bgColor}
              logoDataUrl={logoDataUrl}
              logoSize={logoSize}
            />

            <QRHistory
              history={history}
              onReuse={handleReuse}
              onRemove={removeItem}
              onClear={clearAll}
            />
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="footer">
        <p>
          Feito com Next.js · TypeScript · PWA
          &nbsp;·&nbsp;
          <a
            href="https://github.com/ei-Gih/QR-Code-Generator"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver no GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
