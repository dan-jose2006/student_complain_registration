import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { LiquidMetalButton } from '../../components/ui/LiquidMetalButton';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Prism } from '../../components/ui/Prism';
import {
  Sparkles,
  ArrowRight,
  RotateCw,
  Cpu,
  BarChart,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const featureCards = [
    {
      icon: Cpu,
      title: 'Groq AI Auto-Triage',
      desc: 'Real-time natural language classification suggests complaint category, urgency, department, and summary in under a second.',
      tag: 'AI Intelligence',
    },
    {
      icon: RotateCw,
      title: '3-Stage Lifecycle',
      desc: 'Clear visual progression across Pending, In Progress, and Resolved states with live timestamped updates and notifications.',
      tag: 'Workflow Automation',
    },
    {
      icon: BarChart,
      title: 'Telemetry & Analytics',
      desc: 'Facility managers access category breakdown graphs, resolution rates, trend analysis, and automated executive briefs.',
      tag: 'Real-Time Insights',
    },
    {
      icon: ShieldCheck,
      title: 'Automated RBAC Security',
      desc: 'Role-Based Access Control enforcing strict isolation between student complaint logs and administrative actions.',
      tag: 'Enterprise Security',
    },
    {
      icon: Zap,
      title: 'Instant SLA Escalation',
      desc: 'High-urgency facility failures in electrical, plumbing, and network systems are prioritized immediately.',
      tag: 'SLA Guarantee',
    },
    {
      icon: Activity,
      title: 'Zero-Config Simulation',
      desc: 'Resilient dual-mode architecture that runs seamlessly with PostgreSQL or in-memory simulation.',
      tag: 'High Reliability',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background overflow-x-hidden">
      {/* Hero Section with Interactive 3D WebGL Prism Background ONLY HERE */}
      <section className="relative isolate overflow-hidden min-h-[90vh] flex items-center justify-center pt-16 pb-24 border-b border-border/80">
        {/* 3D WebGL Prism Canvas Container */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Prism
            animationType="3drotate"
            glow={1.4}
            noise={0.35}
            scale={3.6}
            timeScale={0.45}
            hoverStrength={2.0}
            inertia={0.06}
            bloom={1.2}
            colorFrequency={1.0}
            lightMode={isLight}
            transparent={true}
          />
          {/* Subtle gradient vignette to guarantee maximum text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/80 bg-card/85 backdrop-blur-xl shadow-lg text-xs font-semibold text-foreground"
          >
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>Smart Campus Issue & Facility Management</span>
            <Badge variant="outline" className="ml-1 text-[10px] font-mono border-border">
              Waterfall SDLC
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground drop-shadow-sm">
              Report. Track. <span className="underline decoration-border/80 underline-offset-8">Resolve.</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
              An intelligent, centralized campus operations platform with real-time AI triage, automated routing, and transparent status tracking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link to="/register">
              <LiquidMetalButton
                label="Report an Issue"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-xl"
              />
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm font-semibold rounded-full h-[46px] px-7 border-border bg-card/80 backdrop-blur-md hover:bg-accent text-foreground shadow-sm">
                Sign In to Portal
              </Button>
            </Link>
          </motion.div>

          {/* Interactive UI Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-8 max-w-5xl mx-auto"
          >
            <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* Mock Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/80 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-semibold text-foreground ml-2 font-mono">
                    CampusCare Operations Console
                  </span>
                </div>
                <Badge variant="success" className="text-[10px] font-semibold">
                  94.2% Resolution Rate
                </Badge>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="p-4 rounded-2xl bg-card border border-border/80">
                  <p className="text-xs text-muted-foreground font-medium">Total Tickets</p>
                  <p className="text-2xl font-bold text-foreground mt-1">128</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/80">
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pending Triage</p>
                  <p className="text-2xl font-bold text-foreground mt-1">14</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/80">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">In Progress</p>
                  <p className="text-2xl font-bold text-foreground mt-1">21</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/80">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Resolved</p>
                  <p className="text-2xl font-bold text-foreground mt-1">93</p>
                </div>
              </div>

              {/* Sample Ticket Row with AI badge */}
              <div className="mt-4 p-3.5 rounded-2xl bg-muted/30 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center font-bold text-xs text-foreground">
                    AI
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Water pressure failure in Block B Third Floor Washroom
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Categorized as: <span className="font-semibold text-foreground">PLUMBING</span> • Urgency: <span className="font-semibold text-rose-500">HIGH</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info" className="text-[10px]">
                    IN_PROGRESS
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">#TK-1084</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sideways Infinite Streaming Marquee Feature Cards Section */}
      <section className="py-20 bg-muted/20 border-b border-border/80 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <Badge variant="outline" className="border-border">Enterprise Capabilities</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-3">
            Engineered for Speed, Reliability, and Clarity
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Explore continuous intelligent workflows running across the CampusCare infrastructure.
          </p>
        </div>

        {/* Gradient Edge Masks for Smooth Edge Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-20" />

        {/* Continuous Looping Streamline Track */}
        <div className="relative w-full flex items-center overflow-hidden py-4">
          <div className="animate-marquee-stream flex items-stretch gap-6">
            {/* Duplicated list to create the seamless mathematical loop */}
            {[...featureCards, ...featureCards].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="w-[340px] sm:w-[380px] shrink-0 p-6 rounded-3xl border border-border/80 bg-card hover:border-foreground/30 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group cursor-default"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-foreground tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Automated Feature</span>
                    <CheckCircle2 className="w-4 h-4 text-foreground/70" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Waterfall SDLC Phase Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="outline" className="border-border">Software Engineering Process</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Built on the Classical Waterfall Model
          </h2>
          <p className="text-sm text-muted-foreground">
            Six disciplined engineering phases with formal deliverables and quality phase-gates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Requirement Analysis',
              desc: 'IEEE 830 compliant SRS specification defining 15 functional requirements and security bounds.',
            },
            {
              step: '02',
              title: 'System Design',
              desc: 'Three-tier architecture, DFD Levels 0 & 1, Entity-Relationship schemas, and RESTful API contracts.',
            },
            {
              step: '03',
              title: 'Implementation',
              desc: 'Modular TypeScript coding across Express.js API, Prisma ORM, Groq SDK, and React 18 frontend.',
            },
            {
              step: '04',
              title: 'Testing & QA',
              desc: '19 automated unit and integration tests with Vitest & Supertest, plus 25 comprehensive test case matrices.',
            },
            {
              step: '05',
              title: 'Deployment',
              desc: 'Production bundling with Vite, Vercel cloud configuration, and zero-config in-memory testing fallbacks.',
            },
            {
              step: '06',
              title: 'Maintenance',
              desc: 'Student star-rating feedback loops, telemetry monitoring, and automated diagnostic logging.',
            },
          ].map((item) => {
            return (
              <div
                key={item.step}
                className="p-6 rounded-3xl border border-border/80 bg-card hover:border-foreground/40 transition-all space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                    Phase {item.step}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-foreground" />
                </div>
                <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-muted/30 border-t border-border/80 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Ready to enhance campus living and maintenance?
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Experience the new standard of university facility operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/register">
              <LiquidMetalButton
                label="Register as Student"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-lg"
              />
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-[46px] px-7 border-border bg-card hover:bg-accent text-foreground text-sm font-semibold">
                Admin Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
