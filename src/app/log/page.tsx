'use client';

import { useEngagement } from '@/context/EngagementContext';
import Link from 'next/link';
import { Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function Log() {
  const { engagedPosts } = useEngagement();

  return (
    <div className="p-10 max-w-5xl mx-auto w-full">
      <div className="mb-12 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Engagement Log</h1>
          <p className="text-zinc-500 font-medium">History of your interactions.</p>
        </div>
        <div className="flex items-center text-sm font-semibold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200/60">
          <CheckCircle2 className="w-4 h-4 mr-2 opacity-70" />
          {engagedPosts.length} logged
        </div>
      </div>

      {engagedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 text-zinc-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">No engagements yet</h3>
          <p className="text-zinc-500 mb-6 font-medium">When you reply to posts, they will show up here.</p>
          <Link href="/posts" className="bg-zinc-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">
            Find opportunities
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/50 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-4 text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Subreddit</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Post Title</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {engagedPosts.map((ep) => (
                <tr key={ep.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-medium">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-2 opacity-40" />
                      {new Date(ep.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-bold text-zinc-900">{ep.subreddit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/posts/${ep.id}`} className="text-zinc-900 font-bold hover:text-zinc-600 transition-colors flex items-center group-hover:underline">
                      <span className="truncate max-w-sm block">{ep.title}</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {ep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
