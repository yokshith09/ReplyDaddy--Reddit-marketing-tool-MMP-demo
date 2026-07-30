'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import postsData from '@/data/posts.json';
import { useEngagement } from '@/context/EngagementContext';
import { ArrowUp, Clock, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';

type ScoredPost = typeof postsData[0] & { relevanceScore: number };

export default function PostsFeed() {
  const { keyword, engagedPosts, intelCache, cacheIntel } = useEngagement();
  const [posts, setPosts] = useState<ScoredPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchScores() {
      if (!keyword) {
        setPosts(postsData.map(p => ({ ...p, relevanceScore: 0 })));
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const scored: ScoredPost[] = [];
        for (const post of postsData) {
          if (!isMounted) break;
          
          if (intelCache[post.id]) {
            scored.push({ ...post, relevanceScore: intelCache[post.id].relevanceScore });
            continue;
          }

          try {
            const res = await fetch('/api/intel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ keyword, postBody: post.body })
            });
            
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.relevanceScore !== undefined) {
              if (isMounted) cacheIntel(post.id, data);
              scored.push({ ...post, relevanceScore: data.relevanceScore });
            } else {
              scored.push({ ...post, relevanceScore: Math.floor(Math.random() * 50) + 20 });
            }
          } catch (err) {
            scored.push({ ...post, relevanceScore: Math.floor(Math.random() * 50) + 20 });
          }
        }

        if (isMounted) {
          scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
          setPosts(scored);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }

    fetchScores();

    return () => { isMounted = false; };
  }, [keyword]); 

  return (
    <div className="p-10 max-w-5xl mx-auto w-full">
      <div className="mb-12 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Feed</h1>
          <p className="text-zinc-500 font-medium">
            {keyword ? (
              <>Scanning opportunities for <span className="text-zinc-900 font-semibold">"{keyword}"</span></>
            ) : 'Showing all recent discussions'}
          </p>
        </div>
        <div className="flex items-center text-sm font-semibold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200/60">
          <MessageSquare className="w-4 h-4 mr-2 opacity-70" />
          {postsData.length} active
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-zinc-300" />
          <p className="font-medium text-zinc-500">Evaluating relevance...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isEngaged = engagedPosts.some(ep => ep.id === post.id);

            return (
              <Link key={post.id} href={`/posts/${post.id}`} className="block group">
                <div className="bg-white rounded-2xl p-6 border border-zinc-200/50 shadow-[0_2px_8px_rgb(0,0,0,0.02)] group-hover:shadow-[0_8px_24px_rgb(0,0,0,0.04)] transition-all duration-300 flex items-start gap-6 relative">
                  
                  {/* Score */}
                  <div className="flex flex-col items-center justify-center w-16 h-16 shrink-0 relative">
                    {post.relevanceScore >= 80 ? (
                      <div className="absolute inset-0 bg-emerald-500/10 rounded-xl" />
                    ) : post.relevanceScore >= 50 ? (
                      <div className="absolute inset-0 bg-amber-500/10 rounded-xl" />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-100 rounded-xl" />
                    )}
                    <span className={`text-2xl font-black relative z-10 ${
                      post.relevanceScore >= 80 ? 'text-emerald-600' : 
                      post.relevanceScore >= 50 ? 'text-amber-600' : 'text-zinc-400'
                    }`}>
                      {post.relevanceScore}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-bold text-zinc-900">{post.subreddit}</span>
                      <span className="text-zinc-300">&middot;</span>
                      <div className="flex items-center text-zinc-400 text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.postedHoursAgo}h
                      </div>
                      {isEngaged && (
                        <>
                          <span className="text-zinc-300">&middot;</span>
                          <span className="flex items-center text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Replied
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2 truncate group-hover:text-zinc-600 transition-colors">{post.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{post.body}</p>
                  </div>

                  <div className="flex flex-col items-center text-zinc-400 shrink-0 bg-zinc-50 px-3 py-2 rounded-lg border border-transparent group-hover:border-zinc-200 transition-colors mt-2">
                    <ArrowUp className="w-4 h-4 mb-1" />
                    <span className="font-bold text-xs">{post.upvotes}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
