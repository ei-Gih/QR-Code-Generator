# ⬛ QR Code Generator

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Properties-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Instalável-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-00e5a0?style=for-the-badge)

**Gerador de QR Codes moderno, completo e instalável como PWA.**  
Suporta texto, URL, Wi-Fi, PIX e leitura via câmera.

[🚀 Demo ao Vivo](https://qr-code-generator-base.netlify.app) · [📦 Repositório](https://github.com/ei-Gih/QR-Code-Generator) · [🐛 Reportar Bug](https://github.com/ei-Gih/QR-Code-Generator/issues)

</div>

---

## 📸 Screenshots

| Desktop — Dark | Desktop — Light |
|---|---|
| *(adicione screenshot aqui)* | *(adicione screenshot aqui)* |

| Mobile | Scanner | Histórico |
|---|---|---|
| *(mobile)* | *(scanner)* | *(histórico)* |

---

## ✨ Funcionalidades

### Geração de QR Code
- **Texto / URL** — Qualquer texto ou link
- **Wi-Fi** — QR para conexão automática (WPA/WPA2/WEP/sem senha)
- **PIX** — Payload EMV válido para todos os apps bancários brasileiros
- **Scanner** — Leitura de QR Code pela câmera (WebRTC + BarcodeDetector API)

### Personalização
- 🎨 Escolha livre de cor do QR e do fundo (color picker nativo)
- 🖼️ Logo central com 3 tamanhos (não compromete a leitura — usa nível H)
- 👁️ Preview em tempo real com renderização em canvas

### Download
- ⬇️ **PNG** — alta resolução via canvas
- ⬇️ **SVG** — vetorial, qualidade infinita em qualquer tamanho

### Histórico
- 💾 Salvo automaticamente no `localStorage`
- 📋 Exibe os últimos 10 QR codes gerados
- ↩️ Reutilize qualquer entrada com um clique
- 🗑️ Remova itens individualmente ou limpe tudo

### Tema & PWA
- 🌙 Dark / Light mode com detecção automática do sistema
- 📲 Instalável como aplicativo nativo (PWA com Service Worker)
- ⚡ Cache offline com estratégia Cache-First

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript 5 |
| Estilo | CSS puro com Custom Properties (sem framework) |
| QR Engine | `qrcode` (canvas + SVG) |
| Scanner | WebRTC + BarcodeDetector API |
| Persistência | localStorage (histórico, tema) |
| PWA | Service Worker + Web App Manifest |
| Deploy | Netlify |

---

## 📁 Estrutura de Pastas

```
qr-code-generator/
├── app/
│   ├── components/
│   │   ├── CustomizePanel.tsx   # Seletor de cores e logo
│   │   ├── InstallPWA.tsx       # Botão de instalação PWA
│   │   ├── PixForm.tsx          # Formulário PIX (payload EMV)
│   │   ├── QRHistory.tsx        # Lista do histórico
│   │   ├── QRPreview.tsx        # Canvas + botões de download
│   │   ├── QRScanner.tsx        # Scanner via câmera
│   │   ├── TabNav.tsx           # Navegação entre modos
│   │   └── WifiForm.tsx         # Formulário Wi-Fi
│   ├── hooks/
│   │   ├── useHistory.ts        # Gerencia histórico no localStorage
│   │   └── useTheme.ts          # Gerencia dark/light mode
│   ├── lib/
│   │   └── utils.ts             # Funções puras: PIX, Wi-Fi, download
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript centralizados
│   ├── globals.css              # Design system completo
│   ├── layout.tsx               # Layout raiz + metadata PWA
│   └── page.tsx                 # Página principal (orquestrador)
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── screenshots/
│   ├── manifest.json            # Web App Manifest
│   └── sw.js                    # Service Worker
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Como executar localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/ei-Gih/QR-Code-Generator.git
cd QR-Code-Generator

# 2. Instale as dependências
npm install

# 3. Rode em desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Outros comandos

```bash
npm run build        # Build de produção
npm start            # Servidor de produção
npm run type-check   # Verifica tipos TypeScript
npm run lint         # ESLint
```

---

## 🔑 Detalhes Técnicos

### Geração do Payload PIX

O payload PIX segue o padrão **EMV QR Code** definido pelo Banco Central do Brasil. Ele inclui:

- `00` — Payload Format Indicator
- `26` — Merchant Account Information (chave PIX + descrição)
- `52/53/58` — Categoria, moeda (BRL) e país (BR)
- `54` — Valor da transação (opcional)
- `59/60` — Nome e cidade do recebedor
- `62` — Additional Data (txid)
- `6304` — CRC16-CCITT para validação de integridade

### Scanner de QR Code

Utiliza a **BarcodeDetector API** (Chrome 83+, Edge 83+) combinada com **WebRTC** para acesso à câmera. Em navegadores sem suporte, exibe mensagem com link para compatibilidade.

### PWA e Service Worker

Estratégia de cache:
- **Navegação (HTML)**: Network-First com fallback offline
- **Assets estáticos**: Cache-First com atualização em background
- O SW é atualizado automaticamente a cada deploy via `skipWaiting()`

---

## 🌱 Melhorias Futuras

- [ ] Exportação em PDF
- [ ] Compartilhamento via Web Share API
- [ ] QR Code para vCard (contato)
- [ ] Histórico com thumbnails do QR
- [ ] Gerador de QR em lote (CSV upload)
- [ ] API REST pública para geração server-side
- [ ] Analytics de escaneamentos (via URL encurtada)
- [ ] Templates de design prontos

---

## 📊 Antes × Depois

| Critério | Antes | Depois |
|---|---|---|
| Funcionalidades | Texto + cores + logo | + Wi-Fi, PIX, Scanner, Histórico, PWA |
| Exportação | PNG | PNG + SVG |
| Tema | Fixo | Dark/Light + sistema |
| Acessibilidade | Básica | ARIA, foco visível, SR-only |
| TypeScript | Parcial | Strict mode completo |
| Arquitetura | Monolítico | Modular (components + hooks + lib) |
| PWA | ❌ | ✅ Manifest + SW + installable |
| **Nota** | **5/10** | **9/10** |

---

## 👩‍💻 Autora

**Gisele** — Desenvolvedora Front-End em formação

[![GitHub](https://img.shields.io/badge/GitHub-ei--Gih-181717?style=flat-square&logo=github)](https://github.com/ei-Gih)

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais informações.

---

<div align="center">
  Feito com 💚 usando Next.js + TypeScript
</div>
