const surpriseButton = document.getElementById('surpriseButton');
const flowerWrap = document.getElementById('flowerWrap');
const photoGallery = document.getElementById('photoGallery');
const messagePanel = document.getElementById('messagePanel');
const musicButton = document.getElementById('musicButton');
const romanticAudio = document.getElementById('romanticAudio');

let surpriseStarted = false;
let audioContext = null;
let audioNodes = [];
let musicEnabled = false;

function stopMusicNodes() {
  audioNodes.forEach((node) => {
    try {
      node.stop();
      node.disconnect();
    } catch {
      // Ignore nodes that already ended.
    }
  });
  audioNodes = [];
}

function startRomanticMusic() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  stopMusicNodes();

  const now = audioContext.currentTime;
  const chords = [
    [261.63, 329.63, 392.0],
    [246.94, 311.13, 369.99],
    [220.0, 277.18, 349.23],
    [196.0, 246.94, 329.63],
  ];

  chords.forEach((chord, chordIndex) => {
    chord.forEach((frequency) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      oscillator.type = chordIndex % 2 === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;

      filter.type = 'lowpass';
      filter.frequency.value = 1600;

      gain.gain.setValueAtTime(0, now + chordIndex * 1.8);
      gain.gain.linearRampToValueAtTime(0.045, now + chordIndex * 1.8 + 0.18);
      gain.gain.linearRampToValueAtTime(0.03, now + chordIndex * 1.8 + 1.45);
      gain.gain.linearRampToValueAtTime(0, now + chordIndex * 1.8 + 1.75);

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now + chordIndex * 1.8);
      oscillator.stop(now + chordIndex * 1.8 + 1.8);
      audioNodes.push(oscillator);
    });
  });
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  musicButton.textContent = musicEnabled ? 'Matikan Musik' : 'Nyalakan Musik';
  musicButton.setAttribute('aria-pressed', String(musicEnabled));

  if (musicEnabled) {
    romanticAudio.play().catch(() => {});
    startRomanticMusic();
  } else {
    romanticAudio.pause();
    stopMusicNodes();
  }
}

function startSurprise() {
  if (surpriseStarted) {
    if (musicEnabled) {
      startRomanticMusic();
    }
    return;
  }

  surpriseStarted = true;
  document.body.classList.add('revealed');
  flowerWrap.classList.add('reveal-now');
  photoGallery.classList.add('show');
  messagePanel.classList.add('show');
  surpriseButton.textContent = 'Lihat Tulip Mekar';

  if (!musicEnabled) {
    toggleMusic();
  } else {
    startRomanticMusic();
  }
}

surpriseButton.addEventListener('click', startSurprise);
musicButton.addEventListener('click', toggleMusic);

window.addEventListener('load', () => {
  romanticAudio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';
});