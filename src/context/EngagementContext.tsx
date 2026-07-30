'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type EngagedPost = {
  id: string;
  subreddit: string;
  title: string;
  status: 'Replied' | 'Dismissed';
  date: string; // ISO date string
};

export type IntelCache = {
  [postId: string]: {
    relevanceScore: number;
    reasoning: string;
    draftReply: string;
  };
};

type EngagementContextType = {
  keyword: string;
  setKeyword: (k: string) => void;
  engagedPosts: EngagedPost[];
  markAsEngaged: (post: EngagedPost) => void;
  intelCache: IntelCache;
  cacheIntel: (postId: string, intel: { relevanceScore: number; reasoning: string; draftReply: string }) => void;
};

const EngagementContext = createContext<EngagementContextType | undefined>(undefined);

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const [keyword, setKeywordState] = useState('');
  const [engagedPosts, setEngagedPosts] = useState<EngagedPost[]>([]);
  const [intelCache, setIntelCache] = useState<IntelCache>({});

  // Load from local storage on mount
  useEffect(() => {
    const savedKeyword = localStorage.getItem('replyDaddy_keyword');
    if (savedKeyword) setKeywordState(savedKeyword);

    const savedEngagements = localStorage.getItem('replyDaddy_engagements');
    if (savedEngagements) {
      try {
        setEngagedPosts(JSON.parse(savedEngagements));
      } catch (e) {
        console.error("Failed to load engaged posts", e);
      }
    }
  }, []);

  const setKeyword = (k: string) => {
    setKeywordState(k);
    localStorage.setItem('replyDaddy_keyword', k);
    // Clear cache when keyword changes, as intel is specific to the keyword
    setIntelCache({});
  };

  const markAsEngaged = (post: EngagedPost) => {
    setEngagedPosts(prev => {
      if (prev.some(p => p.id === post.id)) return prev;
      const updated = [post, ...prev];
      localStorage.setItem('replyDaddy_engagements', JSON.stringify(updated));
      return updated;
    });
  };

  const cacheIntel = (postId: string, intel: { relevanceScore: number; reasoning: string; draftReply: string }) => {
    setIntelCache(prev => ({
      ...prev,
      [postId]: intel
    }));
  };

  return (
    <EngagementContext.Provider value={{ keyword, setKeyword, engagedPosts, markAsEngaged, intelCache, cacheIntel }}>
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (context === undefined) {
    throw new Error('useEngagement must be used within an EngagementProvider');
  }
  return context;
}
