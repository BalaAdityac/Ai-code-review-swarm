import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Lightbulb, MessageSquare, Repeat } from 'lucide-react';
import type { ReviewComment } from '@/app/page';

interface ReviewResultsProps {
  comments: ReviewComment[];
  isLoading: boolean;
}

const severityConfig = {
  blocker: {
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    label: 'Blocker',
  },
  suggestion: {
    icon: Lightbulb,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
    label: 'Suggestion',
  },
  nit: {
    icon: MessageSquare,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    label: 'Nit',
  },
};

export default function ReviewResults({ comments, isLoading }: ReviewResultsProps) {
  if (isLoading) return null;
  if (!comments || comments.length === 0) return null;

  // Sort: Blockers first, then suggestions, then nits
  const sortedComments = [...comments].sort((a, b) => {
    const order = { blocker: 0, suggestion: 1, nit: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold px-2">Review Feedback</h2>

      <div className="space-y-4">
        <AnimatePresence>
          {sortedComments.map((comment, index) => {
            const config = severityConfig[comment.severity];
            const Icon = config.icon;

            return (
              <motion.div
                key={comment.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 sm:p-5 rounded-xl border ${config.bg} ${config.border} backdrop-blur-sm relative overflow-hidden group`}
              >
                <div className="flex gap-4">
                  <div className={`mt-1 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium text-zinc-100">{comment.title}</h3>
                      <div className="flex gap-2 shrink-0">
                        {comment.isRecurring && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            <Repeat className="w-3 h-3" />
                            Recurring
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.border} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {comment.description}
                    </p>

                    {comment.line !== undefined && (
                      <div className="text-xs text-zinc-500 font-mono mt-2">
                        Line: {comment.line}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}