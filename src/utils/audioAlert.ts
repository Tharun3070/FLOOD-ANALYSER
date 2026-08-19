// Web Audio API emergency siren and warning tone generator

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

let activeSirenNodes: { osc: OscillatorNode; gain: GainNode; intervalId: any } | null = null;

export function playEmergencySiren(durationSeconds = 6) {
  const ctx = getAudioContext();
  if (!ctx) return;

  stopEmergencySiren();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);

    // Modulate pitch between 440Hz and 880Hz (standard disaster alert wail)
    let isHigh = false;
    const intervalId = setInterval(() => {
      if (!ctx || ctx.state === 'closed') return;
      const now = ctx.currentTime;
      if (isHigh) {
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);
      } else {
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);
      }
      isHigh = !isHigh;
    }, 650);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    activeSirenNodes = { osc, gain, intervalId };

    // Auto stop
    setTimeout(() => {
      stopEmergencySiren();
    }, durationSeconds * 1000);
  } catch (e) {
    console.warn('Audio alert error:', e);
  }
}

export function stopEmergencySiren() {
  if (activeSirenNodes) {
    try {
      clearInterval(activeSirenNodes.intervalId);
      if (audioCtx) {
        activeSirenNodes.gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
        setTimeout(() => {
          try {
            activeSirenNodes?.osc.stop();
            activeSirenNodes?.osc.disconnect();
          } catch (_) {}
          activeSirenNodes = null;
        }, 250);
      }
    } catch (_) {
      activeSirenNodes = null;
    }
  }
}

export function playWarningChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.45);
    });
  } catch (e) {
    console.warn(e);
  }
}

export function speakAlertBroadcast(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}
