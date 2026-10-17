# SOP Kiosk - Priemyselná Onboardingová Platforma

## Prepojenie so Stitch MCP (Design System & UI Screens)

Tento projekt je priamo prepojený s nástrojom **Stitch MCP**, ktorý spravuje a generuje kompletný UI/UX dizajn podľa technickej analýzy [`analyza_mvp_onboarding_platforma.md`](./analyza_mvp_onboarding_platforma.md).

### 1. Stitch MCP Identifikátory
- **MCP Server Name**: `stitch`
- **Stitch Project Name**: `projects/3737632796510031215`
- **Stitch Project ID**: `3737632796510031215`
- **Dizajnový systém**: `SOP Kiosk Industrial Modern` (Inter, #2563EB Industrial Blue, #0F172A Dark Slate, #F59E0B Safety Amber, #10B981 Operational Green, #EF4444 Danger Red)

### 2. Aktuálne vygenerované obrazovky
1. **Prehľad & Riadenie linky** (`5f565e941f5f462f82163d31fd3d5dbc`)
   - Prehľad stavu linky, aktívnych zaškolení a kľúčových metrík operátorov.
2. **AI Tvorba a Editor SOP z videa** (`20aff3c546ec486a8e6af4176e634d4f`)
   - Nahrávanie 45s videa, časová os rozstrihania cez FFmpeg, prepis Whisper, generovanie krokov a kvízov.
3. **Katalóg SOP & Auditné verzie** (`00aa2c43362f493c9745f37b7569adfd`)
   - Nemenné verziovanie SOP pre ISO/IATF audit, schvaľovací proces a história zmien.
4. **Operátori, Kiosky & Identifikácia** (`fd591847bec6458aa175e3c4596ffdf6`)
   - Správa operátorov, párovanie NFC kariet, generovanie QR menoviek a autorizácia tabletových kioskov.

### 3. Dostupné operácie cez Stitch MCP
- `list_screens`: zobrazenie všetkých obrazoviek projektu (`projectId: "3737632796510031215"`).
- `get_screen`: načítanie detailov obrazovky vrátane HTML kódu a screenshotov.
- `generate_screen_from_text`: generovanie ďalších obrazoviek (napr. Kiosk režim operátora na tablete).
- `edit_screens`: úprava existujúcich obrazoviek.
- `generate_variants`: generovanie alternatívnych dizajnových variantov.
