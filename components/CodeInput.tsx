import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CodeInputProps {
  onReview: (code: string) => void;
  isLoading: boolean;
}

export default function CodeInput({ onReview, isLoading }: CodeInputProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && !isLoading) {
      onReview(code);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Input Code
          </h2>
        </div>

        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here for review..."
            className="w-full min-h-[300px] bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-y"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!code.trim() || isLoading}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all",
              "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500",
              "text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-violet-600 disabled:hover:to-cyan-600"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Reviewing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Review Code
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}