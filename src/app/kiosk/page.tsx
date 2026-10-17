'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  mockSOPs, 
  mockSteps, 
  mockUsers, 
  mockWorkstations 
} from '@/lib/mock-data';
import { SOPStep, User, TrainingLog } from '@/types';
import { kioskDB, requestPersistentStorage } from '@/lib/dexie-db';
import { 
  CreditCard, 
  QrCode, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Wifi, 
  WifiOff, 
  BellRing, 
  LogOut, 
  Languages, 
  HelpCircle, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  Pause,
  Award
} from 'lucide-react';

export default function KioskPage() {
  // Stav Kiosku: 'idle' (čaká na kartu) | 'sop_select' | 'training' | 'quiz' | 'completed'
  const [kioskState, setKioskState] = useState<'idle' | 'training' | 'quiz' | 'completed'>('idle');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentLang, setCurrentLang] = useState<'sk' | 'uk' | 'sr' | 'en'>('sk');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [isHighVis, setIsHighVis] = useState(true); // Vysoký kontrast pre výrobné haly
  const [startTime, setStartTime] = useState<number>(0);

  const currentSOP = mockSOPs[0];
  const steps = currentSOP.current_version?.steps || mockSteps;
  const currentStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    // Inicializácia offline storage
    requestPersistentStorage();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulácia priloženia karty operátora (NFC / QR)
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentLang((user.preferred_lang as any) || 'sk');
    setCurrentStepIndex(0);
    setQuizScore({ correct: 0, total: 0 });
    setQuizAnswered(null);
    setStartTime(Date.now());
    setKioskState('training');
  };

  const handleNextStep = () => {
    // Ak krok obsahuje kvíz a ešte nebol zodpovedaný, prepneme do kvízového módu
    if (currentStep.quiz_question && quizAnswered === null) {
      setKioskState('quiz');
    } else {
      setQuizAnswered(null);
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setKioskState('training');
      } else {
        finishTraining();
      }
    }
  };

  const handleAnswerQuiz = (selectedIndex: number) => {
    setQuizAnswered(selectedIndex);
    const isCorrect = selectedIndex === currentStep.quiz_question?.correct_index;
    if (isCorrect) {
      setQuizScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setQuizScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    // Po 1.5 sekundy prejdeme na ďalší krok
    setTimeout(() => {
      setQuizAnswered(null);
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setKioskState('training');
      } else {
        finishTraining();
      }
    }, 1500);
  };

  const finishTraining = async () => {
    setKioskState('completed');
    const durationSec = Math.round((Date.now() - startTime) / 1000);

    // Záznam do IndexedDB (Dexie) pre offline synchronizáciu
    try {
      const logEntry: TrainingLog = {
        id: `local-log-${Date.now()}`,
        org_id: 'org-trnava-01',
        user_id: currentUser?.id || 'unknown',
        user: currentUser || undefined,
        sop_version_id: currentSOP.current_version_id || 'v1',
        sop_title: currentSOP.title,
        device_id: 'dev-01',
        lang: currentLang,
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString(),
        quiz_score: 100,
        passed: true,
        quiz_answers: [],
        step_durations: {},
        sos_events: [],
        synced_at: new Date().toISOString()
      };

      await kioskDB.outbox_logs.add(logEntry);
      console.log('[Kiosk] Training log saved to offline Dexie DB');
    } catch (e) {
      console.warn('[Kiosk] Failed to save to Dexie', e);
    }
  };

  const triggerSOS = () => {
    setSosActive(true);
    setShowSOSModal(false);
  };

  return (
    <div className={`min-h-screen flex flex-col select-none ${
      isHighVis ? 'bg-black text-white' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Kiosk Status Bar */}
      <header className="h-16 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-sm font-black tracking-wider uppercase text-blue-400">
              KIOSK #01 • LIS 04
            </span>
          </div>

          <div className="h-5 w-px bg-slate-800" />

          {/* Offline / Online Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {isOffline ? (
              <span className="flex items-center gap-1.5 text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/80">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Režim offline (Dexie aktívne)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/80">
                <Wifi className="w-3.5 h-3.5" />
                <span>Sieť online</span>
              </span>
            )}
          </div>
        </div>

        {/* User Context & Emergency SOS Button */}
        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="flex items-center gap-2.5 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.full_name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-200">
                {currentUser.full_name} ({currentUser.employee_no})
              </span>
              <button
                onClick={() => setKioskState('idle')}
                className="p-1 rounded text-slate-400 hover:text-white"
                title="Odhlásiť"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['sk', 'uk', 'sr', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                  currentLang === lang
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Red Emergency SOS Button (Always Accessible) */}
          <button
            type="button"
            onClick={() => setShowSOSModal(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${
              sosActive
                ? 'bg-red-600 text-white animate-bounce'
                : 'bg-red-700 hover:bg-red-600 text-white'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span>{sosActive ? 'SOS PRIVOLANÉ' : 'SOS MAJSTER'}</span>
          </button>

          {/* Exit to portal */}
          <Link
            href="/"
            className="text-[11px] text-slate-400 hover:text-slate-200 underline ml-2"
          >
            Späť do portálu
          </Link>
        </div>
      </header>

      {/* SOS Active Banner */}
      {sosActive && (
        <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between font-bold text-sm animate-pulse z-20">
          <div className="flex items-center gap-3">
            <BellRing className="w-6 h-6" />
            <span>MAJSTER ZMENY BOL PRIVOLANÝ K TEJTO STANICI. POKRAČUJTE AŽ PO JEHO PRÍCHODE.</span>
          </div>
          <button
            onClick={() => setSosActive(false)}
            className="px-3 py-1 bg-black/40 hover:bg-black/60 rounded text-xs uppercase"
          >
            Zrušiť hlásenie
          </button>
        </div>
      )}

      {/* Screen 1: Idle Screen (Waiting for NFC badge or QR badge) */}
      {kioskState === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-blue-600/20 border-2 border-blue-500 text-blue-400 flex items-center justify-center mb-6 animate-pulse">
            <CreditCard className="w-12 h-12" />
          </div>

          <h1 className="text-4xl font-black tracking-tight mb-2">
            PRILOŽTE ZAMESTNANECKÚ KARTU ALEBO UKÁŽTE QR KÓD
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mb-10">
            NFC čítačka a predná kamera tabletu sú pripravené. Systém načíta vaše školenie automaticky v rodnom jazyku.
          </p>

          {/* Operator Demo Badges (1-Tap login for simulation) */}
          <div className="w-full">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-4">
              Simulácia priloženia karty operátora (Tap pre prihlásenie):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {mockUsers.filter(u => u.role === 'operator').map((op) => (
                <button
                  key={op.id}
                  onClick={() => handleLogin(op)}
                  className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-800 hover:border-blue-500 transition-all flex flex-col items-center gap-3 text-center group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                    {op.full_name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-sm block text-white">
                      {op.full_name}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {op.employee_no}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    Jazyk: {op.preferred_lang}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Screen 2: Training Player Screen (Glove-Friendly Touch UI) */}
      {kioskState === 'training' && (
        <div className="flex-1 flex flex-col p-6 gap-4 max-w-7xl mx-auto w-full">
          {/* Top Step Progress Bar */}
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-sm">
                KROK {currentStep.step_order} / {steps.length}
              </span>
              <h2 className="text-lg font-bold text-white truncate max-w-xl">
                {currentStep.translations[currentLang]?.title || currentStep.translations['sk']?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {steps.map((st, idx) => (
                <div
                  key={st.id}
                  className={`h-3 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-12 bg-blue-500'
                      : idx < currentStepIndex
                      ? 'w-6 bg-emerald-500'
                      : 'w-6 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main Content Area: Video Loop (Left 60%) + Instructions (Right 40%) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Left: Video Player Loop */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden bg-black border-2 border-slate-800 relative shadow-2xl">
              <video
                src={currentStep.video_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Loop Badge Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-mono font-bold text-emerald-400">
                <RotateCcw className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                <span>VIDEO V SLUČKE (BEZ ZVUKU)</span>
              </div>
            </div>

            {/* Right: 3 Clear Bullet Points & High-Vis Yellow Safety Warning */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-4">
                {/* 3 Step Instruction Cards */}
                <div className="space-y-3">
                  {currentStep.translations[currentLang]?.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-start gap-4 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-base font-bold leading-snug text-slate-100 pt-1">
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>

                {/* High-Vis Yellow Safety Warning Strip (BOZP) */}
                {currentStep.translations[currentLang]?.safety && (
                  <div className="p-4 rounded-2xl bg-amber-400 text-black border-2 border-amber-300 flex items-start gap-3 shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-black shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-xs uppercase tracking-wider block">
                        BEZPEČNOSTNÉ UPOZORNENIE (BOZP)
                      </span>
                      <p className="text-sm font-bold mt-0.5 leading-tight">
                        {currentStep.translations[currentLang]?.safety}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Glove-Friendly Navigation Bar (Min 80px Touch Targets) */}
          <div className="h-24 bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            {/* Back Button */}
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => {
                if (currentStepIndex > 0) {
                  setCurrentStepIndex(currentStepIndex - 1);
                }
              }}
              className="h-full px-8 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-white font-black text-lg flex items-center gap-3 border-2 border-slate-700 transition-all active:scale-95"
            >
              <ChevronLeft className="w-8 h-8" />
              <span>SPÄŤ</span>
            </button>

            {/* Step Counter */}
            <div className="text-center font-mono text-sm text-slate-400">
              <span className="text-white font-bold text-lg">{currentStepIndex + 1}</span> z {steps.length}
            </div>

            {/* Next / Quiz Button */}
            <button
              type="button"
              onClick={handleNextStep}
              className="h-full px-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl flex items-center gap-3 shadow-lg transition-all active:scale-95"
            >
              <span>{currentStep.quiz_question ? 'KONTROLNÁ OTÁZKA' : 'ĎALŠÍ KROK'}</span>
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {/* Screen 3: Photo & Inspection Quiz Screen */}
      {kioskState === 'quiz' && currentStep.quiz_question && (
        <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full justify-between">
          <div className="text-center mb-4">
            <span className="px-4 py-1 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold text-xs uppercase border border-blue-500/40">
              KONTROLNÝ KVÍZ • KROK {currentStep.step_order}
            </span>
            <h2 className="text-3xl font-black mt-3 text-white">
              {currentStep.quiz_question.i18n[currentLang]?.question || currentStep.quiz_question.i18n['sk']?.question}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Vyberte správny variant klepnutím na obrazovku.
            </p>
          </div>

          {/* Photo A/B Quiz Options */}
          {currentStep.quiz_question.type === 'photo_ab' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
              {/* Option A (OK Photo) */}
              <button
                type="button"
                onClick={() => handleAnswerQuiz(0)}
                disabled={quizAnswered !== null}
                className={`p-4 rounded-3xl border-4 text-left transition-all active:scale-95 flex flex-col gap-3 ${
                  quizAnswered === null
                    ? 'bg-slate-900 border-slate-800 hover:border-emerald-500'
                    : quizAnswered === 0
                    ? currentStep.quiz_question.correct_index === 0
                      ? 'bg-emerald-950 border-emerald-500 ring-4 ring-emerald-500/50'
                      : 'bg-red-950 border-red-500'
                    : 'opacity-50 border-slate-800'
                }`}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                  <img
                    src={currentStep.image_ok_url}
                    alt="Variant A"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-black/70 text-white font-black text-xl flex items-center justify-center">
                    A
                  </div>
                </div>
                <span className="text-lg font-black text-white px-2">
                  {currentStep.quiz_question.i18n[currentLang]?.options[0]}
                </span>
              </button>

              {/* Option B (NOK Photo) */}
              <button
                type="button"
                onClick={() => handleAnswerQuiz(1)}
                disabled={quizAnswered !== null}
                className={`p-4 rounded-3xl border-4 text-left transition-all active:scale-95 flex flex-col gap-3 ${
                  quizAnswered === null
                    ? 'bg-slate-900 border-slate-800 hover:border-red-500'
                    : quizAnswered === 1
                    ? currentStep.quiz_question.correct_index === 1
                      ? 'bg-emerald-950 border-emerald-500 ring-4 ring-emerald-500/50'
                      : 'bg-red-950 border-red-500'
                    : 'opacity-50 border-slate-800'
                }`}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                  <img
                    src={currentStep.image_nok_url}
                    alt="Variant B"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-black/70 text-white font-black text-xl flex items-center justify-center">
                    B
                  </div>
                </div>
                <span className="text-lg font-black text-white px-2">
                  {currentStep.quiz_question.i18n[currentLang]?.options[1]}
                </span>
              </button>
            </div>
          ) : (
            /* Multiple Choice Quiz Options */
            <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full my-auto">
              {currentStep.quiz_question.i18n[currentLang]?.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleAnswerQuiz(oIdx)}
                  disabled={quizAnswered !== null}
                  className={`p-6 rounded-2xl border-4 font-black text-lg text-left transition-all active:scale-95 flex items-center gap-4 ${
                    quizAnswered === null
                      ? 'bg-slate-900 border-slate-800 hover:border-blue-500 text-white'
                      : oIdx === currentStep.quiz_question?.correct_index
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-4 ring-emerald-500/50'
                      : quizAnswered === oIdx
                      ? 'bg-red-950 border-red-500 text-red-300'
                      : 'opacity-40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-lg font-mono">
                    {String.fromCharCode(65 + oIdx)}
                  </div>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          )}

          {/* Feedback Toast */}
          <div className="h-16 flex items-center justify-center">
            {quizAnswered !== null && (
              <div className={`px-6 py-2.5 rounded-full font-black text-lg flex items-center gap-2 ${
                quizAnswered === currentStep.quiz_question.correct_index
                  ? 'bg-emerald-500 text-black'
                  : 'bg-red-600 text-white'
              }`}>
                {quizAnswered === currentStep.quiz_question.correct_index ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>SPRÁVNA ODPOVEĎ! POKRAČUJEME...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    <span>NESPRÁVNE! POZOR NA SPRÁVNY POSTUP.</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Screen 4: Completed Screen (Digital Sign-off) */}
      {kioskState === 'completed' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mb-6">
            <Award className="w-14 h-14" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
            ŠKOLENIE DOKONČENÉ V NORME
          </span>

          <h1 className="text-3xl font-black text-white mb-2">
            ZAŠKOLENIE ÚSPEŠNE ABSOLVOVANÉ
          </h1>

          <p className="text-slate-400 text-sm mb-6">
            Operátor: <strong className="text-white">{currentUser?.full_name}</strong> • Kvíz: <strong>100% OK</strong> • Takt: <strong>49s</strong>
          </p>

          <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-8 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Postup:</span>
              <span className="text-white font-bold">{currentSOP.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Norma:</span>
              <span className="text-emerald-400 font-bold">STN EN ISO 9001 / IATF 16949</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Offline uloženie:</span>
              <span className="text-blue-400 font-mono font-bold">Dexie IndexedDB (Persisted)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setKioskState('idle')}
            className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <span>DOKONČIŤ A ODHLÁSIŤ</span>
            <CheckCircle2 className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* SOS Confirmation Modal (Glove-Friendly Protection) */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-slate-950 border-4 border-red-600 rounded-3xl p-8 max-w-lg w-full text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-600/30 text-red-500 flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12" />
            </div>

            <h3 className="text-2xl font-black text-white">
              PRIVOLAŤ MAJSTRA K LINKU?
            </h3>
            
            <p className="text-slate-400 text-sm mt-2 mb-8">
              Na riadiacom pulte majstra sa okamžite rozbliká alarm a zaznie zvukové upozornenie pre Stanicu Lis 04.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                type="button"
                onClick={() => setShowSOSModal(false)}
                className="h-16 rounded-2xl bg-slate-900 border-2 border-slate-700 text-white font-black text-base"
              >
                ZRUŠIŤ
              </button>

              <button
                type="button"
                onClick={triggerSOS}
                className="h-16 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-base shadow-lg"
              >
                ÁNO, PRIVOLAŤ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
