'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEngagement } from '@/context/EngagementContext';
import { Search } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { keyword, setKeyword } = useEngagement();
  const [inputVal, setInputVal] = useState(keyword);

  const initialized = useRef(false);

  // Sync state if context changes or initializes late, but only once
  useEffect(() => {
    if (keyword && !initialized.current) {
      setInputVal(keyword);
      initialized.current = true;
    }
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setKeyword(inputVal.trim());
      router.push('/posts');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full p-8 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02)_0%,transparent_100%)] pointer-events-none" />
      
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Find Opportunities</h2>
        <p className="text-zinc-500 mb-12 font-medium">Enter a product, niche, or pain point to monitor.</p>
        
        <form onSubmit={handleSearch} className="w-full relative group">
          <div className="absolute inset-0 bg-zinc-900/[0.03] rounded-3xl blur-xl group-hover:bg-zinc-900/[0.05] transition-colors duration-500" />
          
          <div className="relative bg-white/80 backdrop-blur-2xl border border-zinc-200/50 rounded-3xl p-2 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="pl-6 text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. invoicing software, b2b saas..."
              className="w-full bg-transparent border-none px-6 py-5 text-xl font-medium focus:outline-none focus:ring-0 placeholder:text-zinc-400 text-zinc-900"
              required
              autoFocus
            />
            <button
              type="submit"
              className="bg-zinc-900 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-[0.98] hover:bg-zinc-800 shadow-md active:scale-95"
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="mt-8 flex gap-3 text-sm font-medium text-zinc-400">
          <span>Popular:</span>
          <button onClick={() => setInputVal('email marketing')} className="hover:text-zinc-900 transition-colors">email marketing</button>
          <span>&middot;</span>
          <button onClick={() => setInputVal('fitness coaching')} className="hover:text-zinc-900 transition-colors">fitness coaching</button>
          <span>&middot;</span>
          <button onClick={() => setInputVal('CRM')} className="hover:text-zinc-900 transition-colors">CRM</button>
        </div>
      </div>
    </div>
  );
}
