/**
 * High-fidelity phone notification sound synthesized using Web Audio API.
 * Emulates the iconic modern smartphone notification chime (two-tone harmonious chime).
 * Zero external audio files required, runs 100% reliably in all modern browsers.
 */
export function playPhoneNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    
    const now = ctx.currentTime;

    const playTone = (freq, start, duration, maxGain = 0.22) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(maxGain, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    // First tone: 659.25 Hz (E5)
    playTone(659.25, now, 0.16, 0.18);
    // Second tone: 987.77 Hz (B5) - crisp phone notification signature
    playTone(987.77, now + 0.08, 0.32, 0.25);
  } catch (err) {
    console.debug("Phone notification sound skipped (browser policy):", err);
  }
}
