'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { 
  mockSteps, 
  mockWorkstations, 
  mockSOPs 
} from '@/lib/mock-data';
import { SOPStep } from '@/types';
import { 
  Upload, 
  Sparkles, 
  Scissors, 
  FileText, 
  Check, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Save, 
  Send,
  Eye,
  Languages,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

export default function SOPEditorPage() {
  const [selectedStation, setSelectedStation] = useState(mockWorkstations[1].id);
  const [sopTitle, setSopTitle] = useState('Montáž tesnenia a zalisovanie konektora dverového modulu');
  const [currentLang, setCurrentLang] = useState<'sk' | 'uk' | 'sr' | 'en'>('sk');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [steps, setSteps] = useState<SOPStep[]>(mockSteps);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeStep = steps[activeStepIndex] || steps[0];

  const handleSimulateAI = () => {
    setIsProcessing(true);
    setProcessingStatus('Nahrávam 45s video do Cloudflare R2...');
    
    setTimeout(() => {
      setProcessingStatus('Whisper API: Prepisujem reč majstra a generujem časové značky...');
    }, 1200);

    setTimeout(() => {
      setProcessingStatus('GPT-4o-mini: Rozdeľujem prepis na 3 kroky, odrážky, BOZP a kvízy pre SK, UK, SR, EN...');
    }, 2500);

    setTimeout(() => {
      setProcessingStatus('FFmpeg worker: Strihám video na 720p bezhlučné slučky (veľkosť < 2 MB)...');
    }, 3800);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStatus(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 5000);
  };

  const updateActiveStepTranslation = (field: 'title' | 'safety', value: string) => {
    const updated = [...steps];
    const current = updated[activeStepIndex];
    if (current && current.translations[currentLang]) {
      current.translations[currentLang][field] = value;
      setSteps(updated);
    }
  };

  const updateActiveStepBullet = (bulletIndex: number, value: string) => {
    const updated = [...steps];
    const current = updated[activeStepIndex];
    if (current && current.translations[currentLang]) {
      current.translations[currentLang].bullets[bulletIndex] = value;
      setSteps(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <Sidebar />

      <div className="pl-64 pt-16 flex-1 flex flex-col">
        {/* Header Breadcrumbs */}
        <div className="w-full px-8 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-400">Kiosk Portal</span>
            <span>/</span>
            <span className="text-slate-400">SOP Katalóg</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">AI Tvorba a Editor SOP z videa</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Whisper + GPT-4o-mini + FFmpeg Active
            </span>
          </div>
        </div>

        <main className="p-8 flex flex-col gap-6 max-w-7xl">
          {/* Top Banner & Video Upload Trigger */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  AI Tvorba štandardného postupu z 45s videa
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Majster natočí mobilom 45-sekundové video pri linke. Systém automaticky prepíše hlas cez Whisper, GPT-4o-mini vygeneruje kroky s kontrolným kvízom v 4 jazykoch a FFmpeg pripraví optimalizované slučky pre tablet.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all">
                <Upload className="w-4 h-4" />
                <span>Natočiť / Nahrať video</span>
                <input 
                  type="file" 
                  accept="video/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleSimulateAI}
                />
              </label>

              <button
                type="button"
                onClick={handleSimulateAI}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Simulovať AI pipeline</span>
              </button>
            </div>
          </div>

          {/* AI Processing Status Overlay */}
          {isProcessing && (
            <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 shadow-sm flex items-center gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
              <div>
                <span className="text-xs font-bold text-blue-900 block">
                  Prebieha automatické spracovanie videa
                </span>
                <span className="text-xs text-blue-700">
                  {processingStatus}
                </span>
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>SOP postup bol úspešne spracovaný a publikovaný do tabletov.</span>
            </div>
          )}

          {/* Form Meta: Stanica & Názov */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pracovná stanica / Stroj
              </label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mockWorkstations.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Oficiálny názov SOP postupu
              </label>
              <input
                type="text"
                value={sopTitle}
                onChange={(e) => setSopTitle(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Step Selector & Language Switcher */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">Kroky postupu:</span>
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeStepIndex === idx
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Krok {step.step_order} ({step.start_time}s - {step.end_time}s)
                </button>
              ))}
              <button
                type="button"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                title="Pridať krok"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-bold">
              {(['sk', 'uk', 'sr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLang(lang)}
                  className={`px-3 py-1 rounded uppercase transition-all ${
                    currentLang === lang
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Workspace */}
          {activeStep && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Video Slučka & Časová os */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900">
                      Slučka kroku {activeStep.step_order} (FFmpeg bez zvuku, 720p)
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {(activeStep.end_time - activeStep.start_time).toFixed(1)}s trvanie
                    </span>
                  </div>

                  {/* Video Player */}
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video border border-slate-300">
                    <video
                      src={activeStep.video_url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                      {activeStep.start_time}s ➔ {activeStep.end_time}s
                    </div>
                  </div>

                  {/* Trim Controls */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Začiatok kroku (sekundy)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={activeStep.start_time}
                        onChange={(e) => {
                          const updated = [...steps];
                          updated[activeStepIndex].start_time = parseFloat(e.target.value) || 0;
                          setSteps(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Koniec kroku (sekundy)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={activeStep.end_time}
                        onChange={(e) => {
                          const updated = [...steps];
                          updated[activeStepIndex].end_time = parseFloat(e.target.value) || 0;
                          setSteps(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Fotky OK vs NOK inšpekcia */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900">
                      Fotokontrola OK vs. NOK diel
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Zobrazuje sa v tablete
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> OK Stav
                      </span>
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-emerald-500 bg-slate-100">
                        <img 
                          src={activeStep.image_ok_url} 
                          alt="OK stav"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <button className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-1">
                        <ImageIcon className="w-3 h-3" /> Zmeniť fotku OK
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> NOK Chyba
                      </span>
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-red-500 bg-slate-100">
                        <img 
                          src={activeStep.image_nok_url} 
                          alt="NOK stav"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <button className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-1">
                        <ImageIcon className="w-3 h-3" /> Zmeniť fotku NOK
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Inštrukcie, Odrážky, BOZP a Kvíz */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                  {/* Step Title in Selected Language */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nadpis kroku ({currentLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={activeStep.translations[currentLang]?.title || ''}
                      onChange={(e) => updateActiveStepTranslation('title', e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 3 Step Bullets */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Presne 3 odrážky postupu (Max 12 slov na odrážku)
                    </label>
                    <div className="space-y-2">
                      {activeStep.translations[currentLang]?.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {bIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateActiveStepBullet(bIdx, e.target.value)}
                            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety Warning (BOZP) */}
                  <div>
                    <label className="block text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Bezpečnostné upozornenie (BOZP pás)
                    </label>
                    <textarea
                      rows={2}
                      value={activeStep.translations[currentLang]?.safety || ''}
                      onChange={(e) => updateActiveStepTranslation('safety', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Kontrolná otázka / Kvíz */}
                  {activeStep.quiz_question && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-blue-600" />
                          Kontrolná kvízová otázka pre operátora
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          Správna možnosť: index {activeStep.quiz_question.correct_index + 1}
                        </span>
                      </div>

                      <input
                        type="text"
                        value={activeStep.quiz_question.i18n[currentLang]?.question || ''}
                        onChange={(e) => {
                          const updated = [...steps];
                          if (updated[activeStepIndex].quiz_question?.i18n[currentLang]) {
                            updated[activeStepIndex].quiz_question!.i18n[currentLang].question = e.target.value;
                            setSteps(updated);
                          }
                        }}
                        className="w-full text-xs font-semibold px-3 py-1.5 rounded border border-slate-300 bg-white mb-2"
                      />

                      <div className="space-y-1.5">
                        {activeStep.quiz_question.i18n[currentLang]?.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${activeStepIndex}`}
                              checked={activeStep.quiz_question?.correct_index === oIdx}
                              onChange={() => {
                                const updated = [...steps];
                                if (updated[activeStepIndex].quiz_question) {
                                  updated[activeStepIndex].quiz_question!.correct_index = oIdx;
                                  setSteps(updated);
                                }
                              }}
                              className="text-blue-600"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const updated = [...steps];
                                if (updated[activeStepIndex].quiz_question?.i18n[currentLang]) {
                                  updated[activeStepIndex].quiz_question!.i18n[currentLang].options[oIdx] = e.target.value;
                                  setSteps(updated);
                                }
                              }}
                              className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-200 bg-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 2500);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Uložiť koncept</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      }}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Publikovať verziu 2.0 (IATF 16949)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
