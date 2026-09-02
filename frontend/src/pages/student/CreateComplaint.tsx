import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';
import { ComplaintCategory, Priority, AIComplaintAnalysis } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LiquidMetalButton } from '../../components/ui/LiquidMetalButton';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { AISuggestionCard } from '../../components/common/AISuggestionCard';
import {
  Sparkles,
  Send,
  ArrowLeft,
  MapPin,
  FileText,
  AlignLeft,
  Tag,
  AlertTriangle,
  Wand2,
  CheckCheck,
  X,
  ChevronRight,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'WIFI_IT', label: 'WiFi & Campus Network' },
  { value: 'ELECTRICAL', label: 'Electrical & Power' },
  { value: 'PLUMBING', label: 'Plumbing & Water Supply' },
  { value: 'CLASSROOM_EQUIPMENT', label: 'Classroom & AV Equipment' },
  { value: 'HOSTEL_MAINTENANCE', label: 'Hostel & Residential' },
  { value: 'CLEANLINESS', label: 'Cleanliness & Waste' },
  { value: 'TRANSPORT', label: 'Campus Transport & Parking' },
  { value: 'INFRASTRUCTURE', label: 'Buildings & Infrastructure' },
  { value: 'SECURITY', label: 'Campus Security & Access' },
  { value: 'OTHER', label: 'Other Miscellaneous' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low – Routine Request' },
  { value: 'MEDIUM', label: 'Medium – Needs Attention' },
  { value: 'HIGH', label: 'High – Urgent / Safety Hazard' },
];

export const CreateComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { success, error, info } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('WIFI_IT');
  const [priority, setPriority] = useState<Priority>('MEDIUM');

  const [aiSuggestion, setAiSuggestion] = useState<AIComplaintAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reframe state
  const [isReframing, setIsReframing] = useState(false);
  const [reframePreview, setReframePreview] = useState<{
    reframed: string;
    improvements: string[];
    original: string;
  } | null>(null);

  const [errors, setErrors] = useState<{ title?: string; description?: string; location?: string }>({});

  const handleAnalyzeAI = async () => {
    if (!title.trim() && !description.trim()) {
      error('Please write an issue title or description before requesting AI analysis.');
      return;
    }
    setIsAnalyzing(true);
    try {
      info('Analyzing your issue with Groq LLaMA 3 AI...', 'AI Assistant');
      const analysis = await aiService.analyzeComplaint({ title, description, location });
      setAiSuggestion(analysis);
      success('AI categorized your issue and estimated priority level.', 'AI Triage Ready');
    } catch (err: any) {
      error(err.message || 'AI service temporarily unavailable. You can still fill category manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReframeDescription = async () => {
    if (!description.trim() || description.trim().length < 5) {
      error('Please write a description first before reframing.');
      return;
    }
    setIsReframing(true);
    try {
      info('Rewriting your description with AI...', 'AI Writing Assistant');
      const result = await aiService.reframeDescription({ description, title: title || undefined });
      setReframePreview({ ...result, original: description });
    } catch (err: any) {
      error(err.message || 'AI reframe unavailable. Please try again.');
    } finally {
      setIsReframing(false);
    }
  };

  const handleAcceptReframe = () => {
    if (!reframePreview) return;
    setDescription(reframePreview.reframed);
    if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
    setReframePreview(null);
    success('Description updated with AI improvements!');
  };

  const handleApplyAISuggestion = () => {
    if (!aiSuggestion) return;
    setCategory(aiSuggestion.suggestedCategory);
    setPriority(aiSuggestion.suggestedPriority);
    success(`Applied AI suggestions: ${aiSuggestion.suggestedCategory.replace('_', ' ')} (${aiSuggestion.suggestedPriority} Priority)`);
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!title.trim()) errs.title = 'Title is required.';
    else if (title.trim().length < 5) errs.title = 'Title must be at least 5 characters.';
    if (!description.trim()) errs.description = 'Description is required.';
    else if (description.trim().length < 10) errs.description = 'Description must be at least 10 characters.';
    if (!location.trim()) errs.location = 'Location is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      error('Please fix the validation errors in the form.');
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await complaintService.createComplaint({
        title,
        description,
        category,
        location,
        priority,
        aiCategory: aiSuggestion?.suggestedCategory || null,
        aiPriority: aiSuggestion?.suggestedPriority || null,
        aiSummary: aiSuggestion?.summary || null,
        aiReason: aiSuggestion?.reason || null,
        aiDepartment: aiSuggestion?.suggestedDepartment || null,
        aiConfidence: aiSuggestion?.confidence || null,
      });
      success(`Complaint #${created.id} submitted successfully! Our campus maintenance team will review it.`, 'Ticket Created');
      navigate(`/student/complaints/${created.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to submit complaint. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Raise Campus Issue / Service Request
        </h1>
        <p className="text-sm text-muted-foreground">
          Submit details about broken facilities, IT malfunctions, or residential maintenance requests.
        </p>
      </div>

      <Card className="shadow-md border-border/80 bg-card rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Issue Details</CardTitle>
          <CardDescription>
            Fill out the form below. Use CampusCare AI to auto-categorize or polish your description.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                Issue Title <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Water leaking from hostel bathroom ceiling"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                error={errors.title}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                Campus Location / Building / Room <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Block C – 2nd Floor Room 215"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                }}
                error={errors.location}
                required
              />
            </div>

            {/* Description + Reframe */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                  Detailed Description <span className="text-destructive">*</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Provide context to help maintenance staff
                </span>
              </label>
              <Textarea
                rows={4}
                placeholder="Explain what is happening, since when, and any safety hazards..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                  if (reframePreview) setReframePreview(null);
                }}
                error={errors.description}
                required
              />

              {/* Reframe Button */}
              <button
                type="button"
                onClick={handleReframeDescription}
                disabled={isReframing || description.trim().length < 5}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isReframing ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                {isReframing ? 'Rewriting with AI...' : '✦ Reframe with AI – make it clearer'}
              </button>

              {/* Reframe Preview Card */}
              {reframePreview && (
                <div className="mt-3 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-indigo-500/5 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-violet-500/20 bg-violet-500/10">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-3.5 h-3.5 text-violet-500" />
                      <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                        AI Reframe Preview
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-600 dark:text-violet-300">
                        Groq LLaMA 3
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReframePreview(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Before / After */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Original</p>
                        <div className="p-3 rounded-xl bg-background/60 border border-border/60 text-xs text-muted-foreground leading-relaxed line-through decoration-red-400/50">
                          {reframePreview.original}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                          AI Improved
                        </p>
                        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-xs text-foreground leading-relaxed">
                          {reframePreview.reframed}
                        </div>
                      </div>
                    </div>

                    {/* Improvements */}
                    {reframePreview.improvements.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          What was improved
                        </p>
                        <ul className="space-y-0.5">
                          {reframePreview.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                              <ChevronRight className="w-3 h-3 text-violet-500 mt-0.5 shrink-0" />
                              {imp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleAcceptReframe}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Use Improved Version
                      </button>
                      <button
                        type="button"
                        onClick={() => setReframePreview(null)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        Keep Original
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Triage Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    CampusCare AI Auto-Triaging
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-700 dark:text-purple-300">
                      Groq LLaMA 3
                    </span>
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Click to automatically detect the appropriate category, estimated urgency level, and department routing.
                  </p>
                </div>
              </div>
              <LiquidMetalButton
                type="button"
                label="Analyze with AI"
                icon={<Sparkles className="w-3.5 h-3.5 text-purple-300" />}
                onClick={handleAnalyzeAI}
                isLoading={isAnalyzing}
                className="w-full sm:w-auto shrink-0"
              />
            </div>

            {/* AI Suggestion Card */}
            {aiSuggestion && (
              <AISuggestionCard
                suggestion={aiSuggestion}
                onApply={handleApplyAISuggestion}
                onDismiss={() => setAiSuggestion(null)}
              />
            )}

            {/* Category & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  Complaint Category <span className="text-destructive">*</span>
                </label>
                <Select
                  options={CATEGORY_OPTIONS}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                  Priority Level <span className="text-destructive">*</span>
                </label>
                <Select
                  options={PRIORITY_OPTIONS}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/student/dashboard')}
              >
                Cancel
              </Button>
              <LiquidMetalButton
                type="submit"
                label="Submit Issue Ticket"
                icon={<Send className="w-4 h-4" />}
                isLoading={isSubmitting}
                className="shadow-lg shadow-brand-500/20"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateComplaint;
