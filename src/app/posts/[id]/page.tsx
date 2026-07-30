'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import postsData from '@/data/posts.json';
import { useEngagement } from '@/context/EngagementContext';
import { ArrowLeft, ArrowUp, Sparkles, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { keyword, engagedPosts, markAsEngaged, intelCache, cacheIntel } = useEngagement();
  
  const [post, setPost] = useState<typeof postsData[0] | null>(null);
  const [draft, setDraft] = useState('');
  const [isEngaged, setIsEngaged] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const found = postsData.find(p => p.id === resolvedParams.id);
    if (found) {
      setPost(found);
      
      const engaged = engagedPosts.some(ep => ep.id === found.id);
      setIsEngaged(engaged);

      if (intelCache[found.id]) {
        setDraft(intelCache[found.id].draftReply);
      } else {
        setLoadingDraft(true);
        fetch('/api/intel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword, postBody: found.body })
        })
        .then(async res => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.draftReply) {
            throw new Error('Invalid response');
          }
          return data;
        })
        .then(data => {
          if (isMounted) {
            setDraft(data.draftReply || '');
            cacheIntel(found.id, data);
            setLoadingDraft(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            setDraft("This is a client-side fallback draft reply generated because the API request failed completely. In a normal scenario, this would be a highly contextual, 60-100 word comment that subtly introduces the keyword into the conversation without sounding like an ad. I agree with the original poster's sentiment though!");
            setLoadingDraft(false);
          }
        });
      }
    } else {
      router.push('/posts');
    }

    return () => { isMounted = false; };
  }, [resolvedParams.id, keyword, engagedPosts]); 

  if (!post) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 text-zinc-300 animate-spin" />
      </div>
    );
  }

  const handleMarkAsPosted = () => {
    markAsEngaged({
      id: post.id,
      subreddit: post.subreddit,
      title: post.title,
      status: 'Replied',
      date: new Date().toISOString()
    });
    router.push('/log');
  };

  return (
    <div className="p-10 max-w-3xl mx-auto w-full pb-32">
      <Link href="/posts" className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-10 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
        Back
      </Link>

      <article className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-bold text-zinc-900">{post.subreddit}</span>
          <span className="text-zinc-300">&middot;</span>
          <span className="text-sm text-zinc-500 font-medium">{post.postedHoursAgo}h ago</span>
          {isEngaged && (
            <>
              <span className="text-zinc-300">&middot;</span>
              <span className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Engaged
              </span>
            </>
          )}
        </div>
        
        <h1 className="text-3xl font-extrabold text-zinc-900 mb-6 leading-tight tracking-tight">{post.title}</h1>
        
        <div className="prose prose-zinc max-w-none">
          <p className="text-lg text-zinc-600 leading-relaxed whitespace-pre-wrap">
            {post.body}
          </p>
        </div>
        
        <div className="mt-8 flex items-center text-zinc-400 text-sm font-medium">
          <ArrowUp className="w-4 h-4 mr-1" />
          <span>{post.upvotes} upvotes</span>
        </div>
      </article>

      <div className="relative group">
        {/* Glow effect behind the AI box */}
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative bg-white rounded-2xl border border-zinc-200/60 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Draft Reply
            </h2>
          </div>
          
          <div className="relative">
            {loadingDraft ? (
              <div className="w-full h-40 bg-zinc-50/50 border border-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                <span className="text-sm font-medium">Generating context...</span>
              </div>
            ) : (
              <textarea
                className="w-full h-40 p-5 bg-zinc-50/50 border border-zinc-200/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-zinc-800 resize-y text-base leading-relaxed transition-all"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            )}
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-100">
            <div className="text-xs text-zinc-400 font-medium max-w-[200px] leading-relaxed">
              * Local demo only. Does not post to Reddit API.
            </div>
            <button
              onClick={handleMarkAsPosted}
              disabled={isEngaged || loadingDraft}
              className={`flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isEngaged || loadingDraft
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm hover:shadow active:scale-95'
              }`}
            >
              {isEngaged ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Logged
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Mark as Posted
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
