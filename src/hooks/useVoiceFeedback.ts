import { useCallback, useRef } from 'react';

export const useVoiceFeedback = () => {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const lastSpokenRef = useRef<string>('');

  const speak = useCallback((text: string, force = false) => {
    if (!synth) return;

    // Prevent duplicate speech for the same text within a short window
    if (!force && text === lastSpokenRef.current) return;
    lastSpokenRef.current = text;

    // Cancel current speech to provide immediate feedback
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Tech-Noir Personality Settings
    utterance.rate = 1.05; // Slightly faster for efficiency
    utterance.pitch = 0.8; // Lower pitch for a more serious/tactical feel
    utterance.volume = 1.0;

    // Try to find a robotic/neutral voice if available
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google US English') || 
      v.name.includes('Microsoft David') ||
      v.name.includes('Robot')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synth.speak(utterance);
  }, [synth]);

  return { speak };
};
