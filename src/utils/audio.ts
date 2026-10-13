// Audio synthesis engine using Web Audio API for maximum reliability and zero external latency

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlayingBirthday: boolean = false;
  private birthdayTimeoutIds: number[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBirthdaySong();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Synthesize a warm, bowed viola string tone
  public playViolaString(note: 'C' | 'G' | 'D' | 'A', duration: number = 0.9) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs: Record<'C' | 'G' | 'D' | 'A', number> = {
      C: 130.81, // C3 (Do)
      G: 196.00, // G3 (Sol)
      D: 293.66, // D4 (Re)
      A: 440.00, // A4 (La)
    };

    const freq = freqs[note];
    const now = ctx.currentTime;

    // Bowed string timbre: Sawtooth + subtle triangle + warm lowpass filter + vibrato
    const oscSaw = ctx.createOscillator();
    const oscTri = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    // Vibrato LFO
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();

    vibrato.frequency.setValueAtTime(5.8, now); // 5.8 Hz natural violin vibrato
    vibratoGain.gain.setValueAtTime(freq * 0.015, now); // vibrato depth
    vibrato.connect(oscSaw.frequency);
    vibrato.connect(oscTri.frequency);
    vibrato.start(now);

    oscSaw.type = 'sawtooth';
    oscSaw.frequency.setValueAtTime(freq, now);

    oscTri.type = 'triangle';
    oscTri.frequency.setValueAtTime(freq * 0.5, now); // Warm lower harmonic

    // Warm wooden resonator filter (Viola body resonance)
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(700, now + duration);
    filter.Q.setValueAtTime(2.2, now);

    // Bow attack and release envelope
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.08); // Bow bite
    gainNode.gain.exponentialRampToValueAtTime(0.25, now + 0.25); // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Release

    // Connect nodes
    oscSaw.connect(filter);
    oscTri.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscSaw.start(now);
    oscTri.start(now);

    oscSaw.stop(now + duration + 0.05);
    oscTri.stop(now + duration + 0.05);
    vibrato.stop(now + duration + 0.05);
  }

  // Play custom tone by frequency
  public playTone(freq: number, duration: number = 0.35, type: OscillatorType = 'sine', volume: number = 0.2) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Dissonant error sound (minor 2nd clash) for authentic challenge feedback
  public playDissonantError() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(233.08, now); // Bb3
    osc2.frequency.setValueAtTime(246.94, now); // B3 (clashing dissonance)

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  // Synthesize short static noise for stem mixing console
  public playStaticNoise(duration: number = 0.25) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  // Play rich isolated Billie Eilish stem chord (Gmaj9)
  public playBillieStemChord() {
    if (this.isMuted) return;
    const chord = [196.00, 293.66, 369.99, 440.00, 587.33]; // G, D, F#, A, D
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 1.2, 'triangle', 0.18);
      }, idx * 40);
    });
  }

  // Success Fanfare
  public playSuccess() {
    if (this.isMuted) return;
    const notes = [
      { f: 523.25, t: 0 },    // C5
      { f: 659.25, t: 0.12 }, // E5
      { f: 783.99, t: 0.24 }, // G5
      { f: 1046.50, t: 0.38 } // C6
    ];

    notes.forEach(({ f, t }) => {
      window.setTimeout(() => {
        this.playTone(f, 0.45, 'triangle', 0.25);
      }, t * 1000);
    });
  }

  // Soft Error Bonk
  public playError() {
    this.playDissonantError();
  }

  // Confetti pop
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Billie Eilish Melodic Snippets
  public playBillieSnippet(trackId: 'birds' | 'whatwas' | 'badguy') {
    if (this.isMuted) return;

    if (trackId === 'birds') {
      const notes = [
        { f: 587.33, d: 0.28 }, // D5
        { f: 659.25, d: 0.28 }, // E5
        { f: 739.99, d: 0.35 }, // F#5
        { f: 587.33, d: 0.28 }, // D5
        { f: 493.88, d: 0.45 }, // B4
        { f: 440.00, d: 0.55 }, // A4
      ];
      let delay = 0;
      notes.forEach((n) => {
        window.setTimeout(() => this.playTone(n.f, n.d, 'sine', 0.25), delay);
        delay += (n.d + 0.08) * 1000;
      });
    } else if (trackId === 'whatwas') {
      const notes = [
        { f: 523.25, d: 0.35 },
        { f: 659.25, d: 0.35 },
        { f: 783.99, d: 0.35 },
        { f: 987.77, d: 0.45 },
        { f: 880.00, d: 0.35 },
        { f: 783.99, d: 0.60 },
      ];
      let delay = 0;
      notes.forEach((n) => {
        window.setTimeout(() => this.playTone(n.f, n.d, 'triangle', 0.22), delay);
        delay += (n.d + 0.1) * 1000;
      });
    } else {
      const notes = [
        { f: 196.00, d: 0.18 },
        { f: 196.00, d: 0.18 },
        { f: 293.66, d: 0.22 },
        { f: 233.08, d: 0.22 },
        { f: 196.00, d: 0.22 },
        { f: 174.61, d: 0.22 },
        { f: 196.00, d: 0.35 },
      ];
      let delay = 0;
      notes.forEach((n) => {
        window.setTimeout(() => this.playTone(n.f, n.d, 'sawtooth', 0.2), delay);
        delay += (n.d + 0.05) * 1000;
      });
    }
  }

  // Play Happy Birthday Viola Acoustic Melody
  public playBirthdaySong(onFinish?: () => void) {
    if (this.isMuted) return;
    this.stopBirthdaySong();
    this.isPlayingBirthday = true;

    const melody: { f: number; d: number; pause: number }[] = [
      { f: 261.63, d: 0.35, pause: 0.4 },  // Cum-
      { f: 261.63, d: 0.25, pause: 0.3 },  // plea-
      { f: 293.66, d: 0.55, pause: 0.6 },  // ños
      { f: 261.63, d: 0.55, pause: 0.6 },  // fe-
      { f: 349.23, d: 0.55, pause: 0.6 },  // liz
      { f: 329.63, d: 0.95, pause: 1.0 },  // ...
      
      { f: 261.63, d: 0.35, pause: 0.4 },  // Te
      { f: 261.63, d: 0.25, pause: 0.3 },  // de-
      { f: 293.66, d: 0.55, pause: 0.6 },  // se-
      { f: 261.63, d: 0.55, pause: 0.6 },  // a-
      { f: 392.00, d: 0.55, pause: 0.6 },  // mos
      { f: 349.23, d: 0.95, pause: 1.0 },  // a ti
      
      { f: 261.63, d: 0.35, pause: 0.4 },  // Cum-
      { f: 261.63, d: 0.25, pause: 0.3 },  // plea-
      { f: 523.25, d: 0.55, pause: 0.6 },  // ños
      { f: 440.00, d: 0.55, pause: 0.6 },  // Su-
      { f: 349.23, d: 0.55, pause: 0.6 },  // sa-
      { f: 329.63, d: 0.55, pause: 0.6 },  // na
      { f: 293.66, d: 0.85, pause: 0.9 },  // ...
      
      { f: 466.16, d: 0.35, pause: 0.4 },  // Cum-
      { f: 466.16, d: 0.25, pause: 0.3 },  // plea-
      { f: 440.00, d: 0.55, pause: 0.6 },  // ños
      { f: 349.23, d: 0.55, pause: 0.6 },  // fe-
      { f: 392.00, d: 0.65, pause: 0.7 },  // liz!
      { f: 349.23, d: 1.30, pause: 1.4 },  // 🎻✨
    ];

    let currentDelay = 0;
    melody.forEach((note) => {
      const tid = window.setTimeout(() => {
        if (!this.isPlayingBirthday || this.isMuted) return;
        this.playTone(note.f, note.d, 'triangle', 0.28);
      }, currentDelay);
      this.birthdayTimeoutIds.push(tid);
      currentDelay += note.pause * 1000;
    });

    const finishTid = window.setTimeout(() => {
      this.isPlayingBirthday = false;
      if (onFinish) onFinish();
    }, currentDelay);
    this.birthdayTimeoutIds.push(finishTid);
  }

  public stopBirthdaySong() {
    this.isPlayingBirthday = false;
    this.birthdayTimeoutIds.forEach((id) => clearTimeout(id));
    this.birthdayTimeoutIds = [];
  }

  public isPlayingBirthdaySong(): boolean {
    return this.isPlayingBirthday;
  }

  // Emotional Queen of Tears OST melody (Piano + warm string progression)
  public playQueenOfTearsTheme() {
    if (this.isMuted) return;
    const notes: { f: number; d: number; pause: number }[] = [
      { f: 349.23, d: 0.7, pause: 0.75 }, // F4
      { f: 392.00, d: 0.6, pause: 0.65 }, // G4
      { f: 440.00, d: 0.9, pause: 0.95 }, // A4
      { f: 523.25, d: 0.8, pause: 0.85 }, // C5
      { f: 493.88, d: 0.8, pause: 0.85 }, // B4
      { f: 440.00, d: 1.1, pause: 1.20 }, // A4
      { f: 349.23, d: 0.7, pause: 0.75 }, // F4
      { f: 329.63, d: 0.7, pause: 0.75 }, // E4
      { f: 293.66, d: 1.4, pause: 1.50 }, // D4 (Deep emotional resolution)
    ];

    let delay = 0;
    notes.forEach((n) => {
      window.setTimeout(() => {
        if (this.isMuted) return;
        this.playTone(n.f, n.d, 'sine', 0.22);
        // Add subtle octave harmonic for rich Kdrama string feel
        this.playTone(n.f * 0.5, n.d, 'triangle', 0.12);
      }, delay);
      delay += n.pause * 1000;
    });
  }

  // Concert hall applause and cheering simulation
  public playApplause() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    for (let i = 0; i < 28; i++) {
      window.setTimeout(() => {
        if (this.isMuted) return;
        this.playPop();
      }, Math.random() * 900);
    }
  }

  // Viola Pizzicato (plucked string with fast decay)
  public playPizzicato(note: 'C' | 'G' | 'D' | 'A') {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const freqs: Record<'C' | 'G' | 'D' | 'A', number> = {
      C: 130.81,
      G: 196.00,
      D: 293.66,
      A: 440.00,
    };

    const freq = freqs[note];
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }
}

export const audio = new AudioManager();
