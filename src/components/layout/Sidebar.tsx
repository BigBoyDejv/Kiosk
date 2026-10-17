'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  Users, 
  FileCheck2, 
  Settings, 
  ShieldCheck,
  TabletSmartphone
} from 'lucide-react';

const navItems = [
  {
    name: 'Prehľad & Riadenie linky',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'SOP Postupy & Verzie',
    href: '/sops',
    icon: BookOpen,
  },
  {
    name: 'AI Tvorba z videa',
    href: '/sops/editor',
    icon: Video,
    highlight: true,
  },
  {
    name: 'Operátori & Kiosky',
    href: '/operators',
    icon: Users,
  },
  {
    name: 'Protokoly & Audity',
    href: '/audits',
    icon: FileCheck2,
  },
  {
    name: 'Tablet Kiosk operátora',
    href: '/kiosk',
    icon: TabletSmartphone,
    badge: 'Touch UI',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col justify-between p-4 text-slate-300">
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Riadenie výroby & SOP
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/30 text-blue-300 font-bold">
                    AI 45s
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Industrial Compliance Strip at bottom */}
      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200">
              Audit IATF 16949
            </span>
            <span className="text-[11px] text-slate-400">
              100% platné verzie
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          OK
        </span>
      </div>
    </aside>
  );
}
