import Groq from 'groq-sdk';
import { config } from '../config';
import { logger } from '../utils/logger';
import {
  AIComplaintAnalysisResult,
  AIAdminInsightsResult,
  ComplaintCategory,
  Priority,
} from '../types';

export class AIService {
  private static groqClient: Groq | null = null;

  private static getClient(): Groq | null {
    if (!this.groqClient && config.groqApiKey && config.groqApiKey.trim() !== '' && !config.groqApiKey.includes('placeholder')) {
      try {
        this.groqClient = new Groq({ apiKey: config.groqApiKey });
      } catch (err) {
        logger.warn('Failed to initialize Groq client, will use intelligent fallback:', err);
      }
    }
    return this.groqClient;
  }

  /**
   * Analyzes an issue report to suggest category, priority, department, and summary.
   */
  static async analyzeComplaint(
    title: string,
    description: string,
    location?: string | null
  ): Promise<AIComplaintAnalysisResult> {
    const client = this.getClient();

    if (client) {
      try {
        const prompt = `You are an expert AI campus facility management system for a university.
Analyze the following campus issue report and return ONLY a strict JSON object (no markdown formatting, no code blocks):

Issue Title: "${title}"
Location: "${location || 'Not specified'}"
Description: "${description}"

Valid Categories (must be EXACTLY one of these enum strings):
- "WIFI_IT" (Wi-Fi, network, internet, printers, computers, software)
- "ELECTRICAL" (power outage, fans, lights, switchboards, wiring, AC cooling)
- "PLUMBING" (water leakage, clogged drain, washroom taps, geyser, sewage)
- "CLASSROOM_EQUIPMENT" (projectors, smart boards, mics, podium, desks)
- "HOSTEL_MAINTENANCE" (room doors, latches, beds, cupboards, hostel amenities)
- "CLEANLINESS" (trash, sanitation, dirty corridors, cafeteria hygiene)
- "TRANSPORT" (campus shuttle, bus timings, bicycle stands)
- "INFRASTRUCTURE" (broken walkways, damaged stairs, road potholes, gym equipment)
- "SECURITY" (locks, unauthorized access, broken gate lights, suspicious activity)
- "OTHER" (anything else)

Valid Priorities (must be EXACTLY one of: "LOW", "MEDIUM", "HIGH"):
- HIGH: urgent safety hazards, major water leaks, active electrical sparks, exam hall projector failures
- MEDIUM: standard discomfort, single light/fan issues, slow Wi-Fi, dirty classroom
- LOW: cosmetic damage, minor delays, non-urgent suggestions

Output JSON Schema:
{
  "suggestedCategory": "<CategoryEnum>",
  "suggestedPriority": "<PriorityEnum>",
  "summary": "<Concise 1-sentence summary>",
  "reason": "<1-2 sentence explanation of urgency and facility impact>",
  "suggestedDepartment": "<Responsible campus department, e.g. IT Services, Electrical Wing, Estate & Plumbing, Housekeeping, Security Division>",
  "confidence": <number between 0.70 and 0.99>
}`;

        const completion = await client.chat.completions.create({
          model: config.groqModel,
          messages: [
            {
              role: 'system',
              content:
                'You are a facility triage AI. You only respond with pure valid JSON without markdown wrapping.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 400,
        });

        const rawContent = completion.choices[0]?.message?.content?.trim() || '{}';
        // Clean any accidental markdown quotes
        const cleanedJson = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        // Sanitize enums
        const validCategories: ComplaintCategory[] = [
          'WIFI_IT',
          'ELECTRICAL',
          'PLUMBING',
          'CLASSROOM_EQUIPMENT',
          'HOSTEL_MAINTENANCE',
          'CLEANLINESS',
          'TRANSPORT',
          'INFRASTRUCTURE',
          'SECURITY',
          'OTHER',
        ];
        const validPriorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

        return {
          suggestedCategory: validCategories.includes(parsed.suggestedCategory)
            ? parsed.suggestedCategory
            : 'OTHER',
          suggestedPriority: validPriorities.includes(parsed.suggestedPriority)
            ? parsed.suggestedPriority
            : 'MEDIUM',
          summary: parsed.summary || title,
          reason: parsed.reason || 'Categorized based on keyword analysis of reported issue.',
          suggestedDepartment: parsed.suggestedDepartment || 'Campus Facilities & Services',
          confidence: typeof parsed.confidence === 'number' ? Math.min(Math.max(parsed.confidence, 0.5), 0.99) : 0.92,
        };
      } catch (error) {
        logger.warn('Groq AI analysis failed or returned malformed data. Falling back to local NLP heuristics:', error);
      }
    }

    // Intelligent Fallback (Heuristic NLP Engine)
    return this.fallbackAnalyze(title, description, location);
  }

  /**
   * Rewrites a student's raw complaint description into clear, professional language.
   */
  static async reframeDescription(
    description: string,
    title?: string
  ): Promise<{ reframed: string; improvements: string[] }> {
    const client = this.getClient();

    if (client) {
      try {
        const prompt = `You are an expert writing assistant for a university campus complaint system.
A student has written the following complaint description. Rewrite it to be clear, professional, and detailed enough for the maintenance team to act on it quickly.

${title ? `Issue Title: "${title}"` : ''}
Original Description: "${description}"

Rules:
- Keep all facts and details from the original
- Fix grammar, spelling, and punctuation
- Make it more specific and actionable
- Keep it concise (2-5 sentences max)
- Write in first person from the student's perspective
- Do NOT add information that wasn't in the original

Return ONLY a valid JSON object (no markdown):
{
  "reframed": "<the improved description>",
  "improvements": ["<short note on improvement 1>", "<short note on improvement 2>"]
}`;

        const completion = await client.chat.completions.create({
          model: config.groqModel,
          messages: [
            {
              role: 'system',
              content: 'You are a writing assistant. You only respond with pure valid JSON without markdown wrapping.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 300,
        });

        const rawContent = completion.choices[0]?.message?.content?.trim() || '{}';
        const cleanedJson = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        return {
          reframed: parsed.reframed || description,
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 3) : [],
        };
      } catch (error) {
        logger.warn('Groq reframe failed, returning original description:', error);
      }
    }

    // Fallback: basic cleanup
    const cleaned = description.trim().replace(/\s+/g, ' ');
    const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    const withPeriod = capitalized.endsWith('.') ? capitalized : capitalized + '.';
    return {
      reframed: withPeriod,
      improvements: ['Fixed capitalization and spacing'],
    };
  }

  /**
   * High-accuracy deterministic heuristic analysis when Groq is unavailable.
   */
  private static fallbackAnalyze(
    title: string,
    description: string,
    location?: string | null
  ): AIComplaintAnalysisResult {
    const text = `${title} ${description} ${location || ''}`.toLowerCase();

    let category: ComplaintCategory = 'OTHER';
    let priority: Priority = 'MEDIUM';
    let department = 'Campus Facilities Management';
    let reason = 'Heuristic assessment based on campus issue terms.';

    if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('router') || text.includes('network') || text.includes('portal') || text.includes('printer') || text.includes('pc') || text.includes('server')) {
      category = 'WIFI_IT';
      department = 'Information Technology Services';
      reason = 'Network or digital infrastructure malfunction reported.';
    } else if (text.includes('leak') || text.includes('water') || text.includes('pipe') || text.includes('plumb') || text.includes('tap') || text.includes('washroom') || text.includes('toilet') || text.includes('drain') || text.includes('flush')) {
      category = 'PLUMBING';
      department = 'Estate & Plumbing Services';
      reason = 'Water management issue that may cause puddles or structural dampness.';
      if (text.includes('ceiling') || text.includes('burst') || text.includes('flood') || text.includes('continuous')) {
        priority = 'HIGH';
      }
    } else if (text.includes('spark') || text.includes('power') || text.includes('electric') || text.includes('wire') || text.includes('switch') || text.includes('light') || text.includes('fan') || text.includes('ac') || text.includes('air condition')) {
      category = 'ELECTRICAL';
      department = 'Electrical Maintenance Wing';
      reason = 'Electrical appliance or power circuit irregularity.';
      if (text.includes('spark') || text.includes('smoke') || text.includes('shock')) {
        priority = 'HIGH';
      }
    } else if (text.includes('projector') || text.includes('mic') || text.includes('speaker') || text.includes('smart board') || text.includes('hdmi') || text.includes('podium') || text.includes('whiteboard')) {
      category = 'CLASSROOM_EQUIPMENT';
      department = 'Academic Media & AV Support';
      reason = 'Instructional technology disruption affecting class presentations.';
    } else if (text.includes('hostel') || text.includes('room') || text.includes('cupboard') || text.includes('latch') || text.includes('bed') || text.includes('door lock')) {
      category = 'HOSTEL_MAINTENANCE';
      department = 'Student Residence Administration';
      reason = 'Hostel accommodation hardware repair requirement.';
    } else if (text.includes('clean') || text.includes('trash') || text.includes('garbage') || text.includes('dirty') || text.includes('sanit') || text.includes('spill') || text.includes('dust')) {
      category = 'CLEANLINESS';
      department = 'Sanitation & Housekeeping';
      reason = 'Hygiene or environment cleanliness service needed.';
    } else if (text.includes('bus') || text.includes('shuttle') || text.includes('transport') || text.includes('cycle') || text.includes('parking')) {
      category = 'TRANSPORT';
      department = 'Campus Logistics & Transport';
      reason = 'Commuter schedule or transport infrastructure issue.';
    } else if (text.includes('guard') || text.includes('theft') || text.includes('unauthorized') || text.includes('gate') || text.includes('cctv') || text.includes('security')) {
      category = 'SECURITY';
      department = 'Campus Security Division';
      priority = 'HIGH';
      reason = 'Safety or surveillance concern requiring immediate guard attention.';
    } else if (text.includes('bench') || text.includes('pothole') || text.includes('road') || text.includes('stairs') || text.includes('building') || text.includes('gym')) {
      category = 'INFRASTRUCTURE';
      department = 'Civil Infrastructure & Grounds';
      reason = 'Campus physical structural asset requires maintenance.';
    }

    if (text.includes('urgent') || text.includes('immediately') || text.includes('danger') || text.includes('emergency') || text.includes('broken glass')) {
      priority = 'HIGH';
    }

    return {
      suggestedCategory: category,
      suggestedPriority: priority,
      summary: title.length > 80 ? `${title.substring(0, 77)}...` : title,
      reason,
      suggestedDepartment: department,
      confidence: 0.88,
    };
  }

  /**
   * Generates AI-assisted strategic operational insights for Campus Administrators.
   */
  static async generateAdminInsights(
    complaintsSummary: {
      total: number;
      pending: number;
      inProgress: number;
      resolved: number;
      highPriority: number;
      categoryCounts: Record<string, number>;
      recentSampleTitles: string[];
    }
  ): Promise<AIAdminInsightsResult> {
    const client = this.getClient();

    if (client) {
      try {
        const prompt = `You are the Chief Operations AI for a smart university campus.
Analyze this anonymized complaint summary and return ONLY a strict JSON object:

Statistics:
- Total Complaints: ${complaintsSummary.total}
- Pending: ${complaintsSummary.pending}
- In Progress: ${complaintsSummary.inProgress}
- Resolved: ${complaintsSummary.resolved}
- High Priority Issues: ${complaintsSummary.highPriority}
- Category Counts: ${JSON.stringify(complaintsSummary.categoryCounts)}
- Recent Issues Sample: ${JSON.stringify(complaintsSummary.recentSampleTitles.slice(0, 8))}

Output JSON Schema:
{
  "overview": "<2-sentence executive summary of campus operational health>",
  "keyTrends": ["<Trend 1>", "<Trend 2>", "<Trend 3>"],
  "potentialRisks": ["<Risk 1>", "<Risk 2>"],
  "recommendedActions": ["<Action 1>", "<Action 2>", "<Action 3>"],
  "categoryHotspots": [
    { "category": "PLUMBING", "count": 5, "trend": "increasing" },
    { "category": "WIFI_IT", "count": 4, "trend": "stable" }
  ]
}`;

        const completion = await client.chat.completions.create({
          model: config.groqModel,
          messages: [
            {
              role: 'system',
              content:
                'You are a campus management analytics AI. You return only valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 600,
        });

        const rawContent = completion.choices[0]?.message?.content?.trim() || '{}';
        const cleanedJson = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        return {
          overview: parsed.overview || 'Campus maintenance requests are being tracked across key infrastructure units.',
          keyTrends: parsed.keyTrends || ['Elevated plumbing and electrical maintenance requests in student residential blocks.'],
          potentialRisks: parsed.potentialRisks || ['High priority pending tickets may impact student satisfaction if unresolved beyond SLA.'],
          recommendedActions: parsed.recommendedActions || ['Deploy dedicated technician teams for top reported categories.'],
          categoryHotspots: parsed.categoryHotspots || [
            { category: 'PLUMBING', count: complaintsSummary.categoryCounts['PLUMBING'] || 0, trend: 'increasing' },
            { category: 'WIFI_IT', count: complaintsSummary.categoryCounts['WIFI_IT'] || 0, trend: 'stable' }
          ],
          generatedAt: new Date().toISOString(),
        };
      } catch (error) {
        logger.warn('Groq AI Admin Insights failed, generating dynamic fallback:', error);
      }
    }

    // Dynamic Heuristic Fallback
    const sortedCategories = Object.entries(complaintsSummary.categoryCounts).sort((a, b) => b[1] - a[1]);
    const topCat = sortedCategories[0] ? sortedCategories[0][0].replace('_', ' ') : 'General Facilities';

    return {
      overview: `CampusCare operations summary: ${complaintsSummary.resolved} of ${complaintsSummary.total} issues resolved. ${complaintsSummary.pending} tickets are currently queued for assignment.`,
      keyTrends: [
        `${topCat} issues represent the largest share (${sortedCategories[0]?.[1] || 0} reports) of current campus activity.`,
        `High priority complaints represent ${Math.round((complaintsSummary.highPriority / (complaintsSummary.total || 1)) * 100)}% of total logged campus issues.`,
        `Resolution rate currently stands at ${Math.round((complaintsSummary.resolved / (complaintsSummary.total || 1)) * 100)}%.`
      ],
      potentialRisks: [
        complaintsSummary.pending > 3 ? 'Pending ticket backlog in academic blocks may disrupt lectures.' : 'Ensure regular preventive maintenance on recurring electrical lines.',
        'Delayed feedback collection on resolved tickets could conceal lingering sub-issues.'
      ],
      recommendedActions: [
        `Prioritize maintenance dispatch for top-frequency ${topCat} category.`,
        'Schedule preventive inspection for hostel plumbing and classroom multimedia podiums.',
        'Conduct weekly review of high-priority ticket resolution turnaround time.'
      ],
      categoryHotspots: sortedCategories.slice(0, 3).map(([cat, count]) => ({
        category: cat,
        count,
        trend: count > 3 ? 'increasing' : 'stable',
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}
