import { Brain, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RecalledMemory } from '@/app/page';

interface MemoryPanelProps {
  memories: RecalledMemory[];
  isLoading: boolean;
}

export default function MemoryPanel({ memories, isLoading }: MemoryPanelProps) {
  if (!isLoading && (!memories || memories.length === 0)) {
    return (
      <div className="glass-card p-6 h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
          <Brain className="w-6 h-6 text-zinc-500" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-zinc-300">Memory Engine Ready</h3>
          <p className="text-sm text-zinc-500 max-w-[200px]">
            Input code to see relevant past team rules and feedback.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col h-full max-h-[800px]">
      <div className="p-4 sm:p-6 border-b border-zinc-800/50 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-zinc-100">Team Memory</h2>
          <p className="text-xs text-zinc-400">Recalled context for this review</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-zinc-600" />
              <motion.div
                className="absolute inset-0 border-2 border-indigo-500/50 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <p className="text-sm text-zinc-500">Querying Hindsight...</p>
          </div>
        ) : (
          <AnimatePresence>
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/50 relative group"
              >
                <div className="absolute top-3 right-3 text-zinc-600">
                  <History className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed pr-6">
                  {memory.content}
                </p>
                {memory.relevanceScore && (
                  <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                    Match: {Math.round(memory.relevanceScore * 100)}%
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}