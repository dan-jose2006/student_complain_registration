import React, { useEffect, useState } from 'react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';
import { AIAdminInsights } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { LiquidMetalButton } from '../../components/ui/LiquidMetalButton';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../lib/utils';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RotateCw,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminAIInsights: React.FC = () => {
  const { success, error } = useToast();
  const [insights, setInsights] = useState<AIAdminInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInsights = async () => {
    try {
      const data = await aiService.getAdminInsights();
      setInsights(data);
    } catch (err: any) {
      error(err.message || 'Failed to generate AI insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInsights();
    success('AI campus intelligence synthesized from latest ticket data!', 'Insights Updated');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-foreground" />
              AI Campus Operational Insights
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              Groq LLM Engine
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Automated trend discovery, risk warnings, and strategic facility recommendations.
          </p>
        </div>

        <LiquidMetalButton
          label="Refresh AI Insights"
          icon={<RotateCw className="w-3.5 h-3.5" />}
          onClick={handleRefresh}
          isLoading={refreshing}
          className="shrink-0"
        />
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-36 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      ) : insights ? (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-border/80 bg-card shadow-md relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between text-foreground">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-foreground" />
                    Executive Operations Briefing
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Generated: {formatDate(insights.generatedAt)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
                  {insights.overview}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Key Trends & Potential Risks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Trends */}
            <Card className="shadow-sm border-border/80 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Key Infrastructure Trends
                </CardTitle>
                <CardDescription>
                  Patterns extracted from recent issue report logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.keyTrends.map((trend, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border/80 text-xs text-foreground leading-relaxed"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                        {idx + 1}
                      </div>
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Potential Risks */}
            <Card className="shadow-sm border-border/80 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-foreground">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Potential Vulnerabilities & Risks
                </CardTitle>
                <CardDescription>
                  Areas requiring immediate attention or preventative service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.potentialRisks.map((risk, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-muted/40 border border-border/80 text-xs text-foreground leading-relaxed"
                    >
                      <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                        !
                      </div>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Actions */}
          <Card className="shadow-sm border-border/80 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                Strategic Action Plan & Resource Recommendations
              </CardTitle>
              <CardDescription>
                High-impact tasks prioritized by AI facility analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.recommendedActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default AdminAIInsights;
