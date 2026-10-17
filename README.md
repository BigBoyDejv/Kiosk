# SOP Kiosk - Priemyselná Onboardingová Platforma

Moderná PWA aplikácia pre zaškoľovanie operátorov vo výrobnej hale so slabým signálom, AI tvorbou štandardných operačných postupov (SOP) a offline synchronizáciou.

## Architektúra & Tech Stack
- **Frontend**: Next.js 15+ (App Router), React 19, Tailwind CSS v4, Lucide Icons, Material Symbols
- **Dizajnový systém**: `SOP Kiosk Industrial Modern` generovaný cez **Stitch MCP** (Project ID `3737632796510031215`)
- **Databáza & Auth**: Supabase (PostgreSQL, Row Level Security)
- **Offline Storage**: Dexie.js (IndexedDB) + Service Worker cache
- **Médiá & Videá**: Cloudflare R2 + FFmpeg pipeline
- **AI Pipeline**: OpenAI Whisper (prepis hlasu) + GPT-4o-mini (štruktúrovanie, kroky, BOZP, kvízy a preklady)

## Režimy aplikácie
1. **Riadiaci pult majstra (`/`)**:
   - Prehľad liniek a taktového času
   - Monitorovanie aktívnych zaškolení a vyriešených SOS incidentov
   - Štatistiky úspešnosti a kľúčové priemyselné metriky
2. **AI Tvorba a Editor SOP (`/sops/editor`)**:
   - Nahrávanie 45s videa z linky
   - Automatický Whisper prepis a rozdelenie na kroky cez GPT-4o-mini
   - Časová os a strih slučiek cez FFmpeg
   - Nastavenie fotiek OK vs. NOK a kontrolných otázok
3. **Katalóg SOP & Auditné verzie (`/sops`)**:
   - Nemenné verziovanie SOP pre normy ISO 9001 a IATF 16949
   - Schvaľovací proces a história zmien
4. **Operátori, Kiosky & Identifikácia (`/operators`)**:
   - Správa operátorov a párovanie zamestnaneckých kariet (NFC / QR menovky)
   - Autorizácia a monitorovanie tabletových kioskov
5. **Kiosk operátora pri linke (`/kiosk`)**:
   - Dotykové rozhranie prispôsobené pre prácu v rukaviciach (minimálna veľkosť tlačidiel 64–80px)
   - Prihlásenie pípnutím karty (Web NFC) alebo prednou kamerou (QR kód)
   - Prehrávanie videa v slučke, 3 odrážky postupu, BOZP výstražný pás
   - Kvíz OK vs. NOK diel a kontrolná otázka
   - SOS núdzové tlačidlo s okamžitým privolaním majstra
   - 100% offline prevádzka s lokálnym ukladaním cez Dexie.js

## Spustenie lokálne
```bash
npm install
npm run dev
```

## Premenné prostredia (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xzmceuctjmfpdetxlvlo.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_pFIeMep6_OaZs01hWkZuog_sYiWeOfL
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pFIeMep6_OaZs01hWkZuog_sYiWeOfL
```
