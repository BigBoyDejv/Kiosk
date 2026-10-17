'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Factory, 
  ChevronDown, 
  Bell, 
  AlertTriangle, 
  Tablet, 
  CheckCircle2, 
  CloudCheck,
  User,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeSOSCount?: number;
}

export default function Navbar({ activeSOSCount = 0 }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6 shadow-sm">
      {/* Brand & Plant Context */}
      <div className="flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            K
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base leading-none">
                SOP KIOSK
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">
                PROD
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 leading-none mt-0.5">
              Industrial Modern OS
            </span>
          </div>
        </Link>

        <div className="h-6 w-px bg-slate-200" />

        {/* Selected Facility / Line Selector */}
        <div className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs cursor-pointer transition-colors">
          <Factory className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-800">
            Závod Trnava • Linka 04 / Montáž dverí
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* Cloud Status & Quick Actions */}
      <div className="flex items-center gap-4">
        {/* Cloud Status Badge */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">Cloud EU (Frankfurt) • Supabase Online</span>
        </div>

        {/* Switch to Operator Tablet Kiosk mode button */}
        <Link
          href="/kiosk"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Otvoriť Kiosk operátora</span>
        </Link>

        {/* SOS Alert Bell */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Aktívne hlásenia linky"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {activeSOSCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
          </button>
          
          <button
            type="button"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Supervisor Profile */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              Peter Horváth
            </span>
            <span className="text-[11px] text-slate-500 leading-tight">
              Majster zmeny A
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
