'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import CodeInput from '@/components/CodeInput';
import ReviewResults from '@/components/ReviewResults';
import MemoryPanel from '@/components/MemoryPanel';

export type ReviewSeverity = 'blocker' | 'suggestion' | 'nit';

export interface ReviewComment {
  id: string;
  severity: ReviewSeverity;
  title: string;
  description: string;
  line?: number;
  isRecurring?: boolean;
}

export interface RecalledMemory {
  id: string;
  content: string;
  relevanceScore: number;
}

export default function Home() {
  const [isReviewing, setIsReviewing] = useState(false);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [memories, setMemories] = useState<RecalledMemory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async (code: string) => {
    setIsReviewing(true);
    setError(null);
    setComments([]);
    setMemories([]);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze code');
      }

      setComments(data.comments || []);
      setMemories(data.memories || []);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-12">
        <Hero />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CodeInput onReview={handleReview} isLoading={isReviewing} />
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <ReviewResults comments={comments} isLoading={isReviewing} />
          </div>
          
          <div className="lg:col-span-1">
            <MemoryPanel memories={memories} isLoading={isReviewing} />
          </div>
        </div>
      </div>
    </main>
  );
}