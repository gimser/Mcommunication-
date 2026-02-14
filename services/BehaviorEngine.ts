
// Behavioral Engine Service (Ethical Layer)
// This service acts as the "Conscience" of the platform, managing incentives and preventing addiction.

export interface ImpactAnalysis {
  qualityScore: number; // 0-100 (Replaces viral score)
  semanticClass: 'noise' | 'shallow' | 'constructive' | 'deep_insight';
  hints: string[];
  flags: string[]; // e.g., "inflammatory", "too_short"
  queueStatus: 'instant' | 'review_required' | 'meaning_layer_candidate';
}

export interface WellbeingStatus {
  status: 'healthy' | 'warning' | 'break_needed';
  sessionDuration: number; // in minutes
  interactionVelocity: number; // actions per minute
  message?: string;
  cognitiveMode: 'immersive' | 'balanced' | 'zen'; // New UI Mode
}

// Scenario 5: Self-Reflection Data Structure
export interface Reflection {
  id: string;
  title: string;
  observation: string;
  archetype: string;
  timestamp: number;
}

// Scenario 7 & 11: Mental State & Time Distortion Types
export type MentalState = 'neutral' | 'anxious' | 'curious' | 'fatigued';
export type ContentRecommendation = 'standard' | 'visual_sakina' | 'deep_ilm' | 'community_amal';
export type FlowPace = 'accelerated' | 'neutral' | 'decelerated' | 'stasis';

// Scenario 6: Absence Digest Type
export interface AbsenceDigest {
  lastActive: number;
  missedCount: number;
  highlights: {
    id: string;
    title: string;
    category: 'gov' | 'personal' | 'community';
    meta: string;
  }[];
}

// Scenario 9: Social Gravity Result
export interface GravityResult {
  isRelevant: boolean;
  label: string; // e.g. "High Relevance", "Trending in Circle"
  score: number;
}

// Scenario 8: Reward Pattern
export interface RewardPattern {
  visibilityTier: 'standard' | 'elevated' | 'unexpected_blessing';
  reachMultiplier: number;
}

// New: Feed Layers for the Civic Square
export type FeedLayer = 'sovereign' | 'meaning' | 'proximity' | 'live' | 'discovery';

// Simulation of user session state
let sessionStartTime = Date.now();
let interactionCount = 0;
let lastInteractionTime = Date.now();
// Moving average of time between clicks (ms)
let velocityHistory: number[] = []; 

// Scrolling state for Scenario 7 & 11
let lastScrollY = 0;
let scrollVelocity = 0;
let scrollHistory: number[] = [];

// Mock delay to simulate AI processing
const processDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const BehaviorEngine = {

  /**
   * Analyzes a draft post for "Meaning Evaluation Queue".
   */
  async analyzeDraft(text: string, hasMedia: boolean, contextNote?: string): Promise<ImpactAnalysis> {
    await processDelay(800); // Simulate semantic processing

    const length = text.length;
    let qualityScore = 50; // Start neutral
    const hints: string[] = [];
    const flags: string[] = [];
    let semanticClass: ImpactAnalysis['semanticClass'] = 'shallow';

    // 1. Context Bonus (Solution 2)
    if (contextNote && contextNote.length > 5) {
        qualityScore += 15;
        hints.push("Context added: This significantly improves post clarity.");
    }

    // 2. Length & Clarity Check
    if (length < 15 && !hasMedia) {
      qualityScore -= 20;
      semanticClass = 'noise';
      hints.push("Draft is too short. Add context to reach the Meaning Layer.");
      flags.push("low_effort");
    } else if (length > 50 && length < 150) {
      qualityScore += 20;
      semanticClass = 'constructive';
      hints.push("Good clarity. Your post is readable and direct.");
    } else if (length >= 150) {
      qualityScore += 40;
      semanticClass = 'deep_insight';
      hints.push("High depth detected. This qualifies for the 'Civic Discussion' stream.");
    }

    // 3. Emotional/Civility Check (Mock Keywords)
    const inflammatoryWords = ['hate', 'stupid', 'worst', 'idiots', 'destroy'];
    const constructiveWords = ['propose', 'solution', 'community', 'think', 'improve', 'help'];
    
    const hasInflammatory = inflammatoryWords.some(w => text.toLowerCase().includes(w));
    const hasConstructive = constructiveWords.some(w => text.toLowerCase().includes(w));

    if (hasInflammatory) {
        qualityScore -= 40;
        flags.push("inflammatory");
        hints.push("⚠️ Emotional language detected. This may limit distribution to preserve civil discourse.");
    }

    if (hasConstructive) {
        qualityScore += 15;
        hints.push("✨ Constructive tone detected.");
    }

    // 4. Media Context
    if (hasMedia) {
      qualityScore += 10;
    }

    // 5. Determine Queue Status
    let queueStatus: ImpactAnalysis['queueStatus'] = 'instant';
    if (semanticClass === 'deep_insight' || hasConstructive || (contextNote && contextNote.length > 10)) {
        queueStatus = 'meaning_layer_candidate';
    } else if (hasInflammatory) {
        queueStatus = 'review_required';
    }

    // Cap Score
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    return { 
        qualityScore, 
        semanticClass, 
        hints, 
        flags, 
        queueStatus 
    };
  },

  /**
   * Scenario 5: Self-Reflection Loop
   */
  async generateReflection(): Promise<Reflection | null> {
    await processDelay(2500); 
    // Return null for empty state
    return null;
  },

  /**
   * Tracks user interaction to monitor for addictive behavior.
   */
  trackInteraction(type: 'scroll' | 'click' | 'view'): void {
    const now = Date.now();
    const timeDelta = now - lastInteractionTime;
    
    interactionCount++;
    lastInteractionTime = now;
    
    velocityHistory.push(timeDelta);
    if (velocityHistory.length > 10) velocityHistory.shift();

    if (timeDelta < 500) {
        console.debug('[BehaviorEngine] High velocity interaction detected.');
    }
  },

  /**
   * Returns the current Digital Wellbeing status of the user.
   */
  getWellbeingStatus(): WellbeingStatus {
    const now = Date.now();
    const durationMinutes = Math.floor((now - sessionStartTime) / 60000);
    
    const avgVelocity = velocityHistory.length > 0 
      ? velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length 
      : 2000; 

    let cognitiveMode: WellbeingStatus['cognitiveMode'] = 'immersive';

    if (avgVelocity < 800) { 
      cognitiveMode = 'zen'; 
    }
    else if (durationMinutes > 45) {
      cognitiveMode = 'zen';
    }
    else if (durationMinutes > 20) {
      cognitiveMode = 'balanced';
    }

    let status: WellbeingStatus['status'] = 'healthy';
    let message = undefined;

    if (durationMinutes > 60 || interactionCount > 100) {
      status = 'break_needed';
      message = "You have caught up with the 5 Essential Updates for today. We respect your time.";
      cognitiveMode = 'zen'; 
    } else if (durationMinutes > 30) {
      status = 'warning';
    }

    return {
      status,
      sessionDuration: durationMinutes,
      interactionVelocity: interactionCount / (durationMinutes || 1),
      message,
      cognitiveMode
    };
  },

  /**
   * Simulates the "Civil Trust Layer" validation.
   */
  requiresCivilValidation(category: string): boolean {
    const civilCategories = ['community_event', 'volunteering', 'opinion', 'poll'];
    return civilCategories.includes(category);
  },

  /**
   * Checks for absence context (Scenario 6)
   */
  async checkAbsenceContext(): Promise<AbsenceDigest | null> {
    await processDelay(800);
    return null;
  },

  /**
   * Calculates social gravity for Live Streams (Scenario 9)
   */
  calculateSocialGravity(entityId: string, tags: string[]): GravityResult {
    const relevantTags = ['GovTech', 'DigitalID', 'Morocco', 'Startups', 'Policy'];
    const matches = tags.filter(t => relevantTags.includes(t)).length;
    
    if (matches > 0) {
        return {
            isRelevant: true,
            label: matches > 1 ? 'Highly Relevant to your skills' : 'Trending in your circle',
            score: 85
        };
    }
    
    return {
        isRelevant: false,
        label: 'Low Relevance',
        score: 20
    };
  },

  /**
   * Ingests scroll data to determine mental state (Scenario 7)
   */
  ingestScrollData(scrollY: number): void {
    const delta = Math.abs(scrollY - lastScrollY);
    lastScrollY = scrollY;
    
    scrollHistory.push(delta);
    if (scrollHistory.length > 50) scrollHistory.shift();
  },

  /**
   * Determines mental state based on interaction patterns (Scenario 7)
   */
  getAlgorithmicState(): { state: MentalState, recommendation: ContentRecommendation } {
    const avgScroll = scrollHistory.reduce((a, b) => a + b, 0) / (scrollHistory.length || 1);
    
    if (avgScroll > 80) {
        return { state: 'anxious', recommendation: 'visual_sakina' };
    } else if (avgScroll < 10 && scrollHistory.length > 10) {
        return { state: 'fatigued', recommendation: 'deep_ilm' };
    } else if (interactionCount > 20 && avgScroll < 40) {
        return { state: 'curious', recommendation: 'community_amal' };
    }
    
    return { state: 'neutral', recommendation: 'standard' };
  },

  /**
   * Gets current flow pace for Time Distortion (Scenario 11)
   */
  getFlowPace(): FlowPace {
    const avgScroll = scrollHistory.reduce((a, b) => a + b, 0) / (scrollHistory.length || 1);
    
    if (avgScroll > 60) return 'accelerated';
    if (avgScroll < 5 && scrollHistory.length > 20) return 'decelerated';
    return 'neutral';
  },

  /**
   * Calculates variable reward pattern (Rizq) (Scenario 8)
   */
  calculateRewardPattern(qualityScore: number): RewardPattern {
    const randomFactor = Math.random();
    
    if (randomFactor > 0.92) {
        return { visibilityTier: 'unexpected_blessing', reachMultiplier: 5.0 };
    }
    
    if (qualityScore > 80) {
        return { visibilityTier: 'elevated', reachMultiplier: 2.5 };
    }
    
    return { visibilityTier: 'standard', reachMultiplier: 1.0 };
  },

  /**
   * Classifies a post into the "Civic Square" layers.
   */
  classifyPostLayer(post: any): FeedLayer {
    if (post.isOfficial || post.isNationalAnnouncement || post.isLocalAlert) {
      return 'sovereign';
    }
    
    // Meaning Layer: Education, Deep Insights, Civil Verified
    if (post.isCivil || (post.content?.text?.length > 150) || post.content?.hashtags?.includes('DeepDive')) {
      return 'meaning';
    }

    // Proximity Layer: Social Gravity, known contacts
    if (post.affinityContext) {
      return 'proximity';
    }

    // Live Presence
    if (post.isLive) {
      return 'live';
    }

    // Default to discovery
    return 'discovery';
  }
};
