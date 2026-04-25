import type { WorkoutSession } from './types';

// Vexo Neural Interface — Gemini API Gateway
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const analyzeWorkoutSession = async (session: WorkoutSession, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const accuracy = session.repsAttempted > 0 
    ? Math.round((session.currentReps / session.repsAttempted) * 100) 
    : 100;
  
  const badReps = session.feedback.filter(f => f.type === 'bad').length;
  const warnings = session.feedback.filter(f => f.type === 'warn').length;
  const recentFeedback = session.feedback.slice(0, 5).map(f => f.text).join('; ');

  const prompt = `
    Act as VEXO, a high-performance Cyber-Coach in a dark tech-noir future.
    Analyze the following pushup session data for a tactical debrief:
    - Target: ${session.targetReps}
    - Valid Reps: ${session.currentReps}
    - Total Attempts: ${session.repsAttempted}
    - Accuracy: ${accuracy}%
    - Major Faults: ${badReps}
    - Minor Warnings: ${warnings}
    - Recent Feedback: ${recentFeedback}

    Requirement: 
    1. Write a 2-3 sentence intense, "neural" assessment. 
    2. Use cyberpunk/technical terminology (e.g., neural pathways, biometric sync, kinetic chain).
    3. Be critical but motivating.
    4. Use ALL CAPS for the first sentence.
    5. End with "// ANALYSIS_COMPLETE".
  `;

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error('NEURAL_LINK_FAILURE');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Failed to fetch AI analysis:', error);
    return "NEURAL LINK FAILURE. BIOMETRIC DATA CORRUPTED. UNABLE TO GENERATE TACTICAL DEBRIEF. // ERROR_0x404";
  }
};
