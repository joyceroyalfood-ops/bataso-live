const ttsManager = {
  enabled: true,
  speak(text) {
    if (!this.enabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  },
  playTone({ frequency = 440, duration = 220 } = {}) {
    if (!this.enabled || !window.AudioContext) return;
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.03;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, duration);
  }
};

export { ttsManager };
