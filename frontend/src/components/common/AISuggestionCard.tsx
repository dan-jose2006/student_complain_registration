import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CategoryBadge, PriorityBadge } from './StatusBadge';
import { AIComplaintAnalysis } from '../../types';
import { Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface AISuggestionCardProps {
  suggestion: AIComplaintAnalysis;
  onApply: () => void;
  onDismiss: () => void;
}

export const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  suggestion,
  onApply,
  onDismiss,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-card dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-card shadow-md overflow-hidden relative">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500 text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  CampusCare AI Analysis
                  <Badge variant="ai" className="text-[10px]">
                    {Math.round(suggestion.confidence * 100)}% Confidence
                  </Badge>
                </h4>
                <p className="text-xs text-muted-foreground">
                  AI-assisted category & priority triage recommendation
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-card/80 border border-border/80 text-xs">
            <div>
              <span className="text-muted-foreground block mb-1 font-medium">Suggested Category</span>
              <CategoryBadge category={suggestion.suggestedCategory} />
            </div>
            <div>
              <span className="text-muted-foreground block mb-1 font-medium">Suggested Priority</span>
              <PriorityBadge priority={suggestion.suggestedPriority} />
            </div>
            <div>
              <span className="text-muted-foreground block mb-1 font-medium">Assigned Department</span>
              <span className="font-semibold text-foreground truncate block">
                {suggestion.suggestedDepartment}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="text-muted-foreground">
              <strong className="text-foreground">AI Summary:</strong> {suggestion.summary}
            </div>
            <div className="text-muted-foreground">
              <strong className="text-foreground">Reasoning:</strong> {suggestion.reason}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-muted-foreground italic flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-muted-foreground" />
              Suggestions are advisory. You have final control.
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-xs h-8"
              >
                Ignore
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={onApply}
                className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Suggestions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
