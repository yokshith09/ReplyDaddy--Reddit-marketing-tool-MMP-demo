'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ListTodo, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Search', path: '/', icon: Search },
    { label: 'Opportunities', path: '/posts', icon: Sparkles },
    { label: 'Engagement Log', path: '/log', icon: ListTodo },
  ];

  return (
    <aside className="w-64 fixed h-full bg-transparent p-6 flex flex-col z-50">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shadow-md">
          <span className="text-white font-extrabold text-sm">RD</span>
        </div>
        <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight">ReplyDaddy</h1>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-zinc-900 text-white shadow-md' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-70'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Workspace</div>
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200/60 rounded-xl px-3 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Acme Corp
        </div>
      </div>
    </aside>
  );
}
