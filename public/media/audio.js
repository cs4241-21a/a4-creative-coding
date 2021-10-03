let analyser;
let source;
let gainNode;
const audio = document.querySelector('audio');
const audioSource = document.getElementById('audioSource');
let playing = false;
let initialized = false;
export let frequencyData;
const fftSize = 4096;
export let bufferLength = fftSize / 2;

export function Range(low, high) {
    this.low = Math.floor(bufferLength * low);
    this.high = Math.floor(bufferLength * high);
    this.size = this.high - this.low;
}

export function initAudio() {
    const audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;

    frequencyData = new Uint8Array(bufferLength);

    source = audioContext.createMediaElementSource(audio);
    gainNode = audioContext.createGain();
    source.connect(analyser);
    source.connect(gainNode).connect(audioContext.destination);
    setRate(1);
    initialized = true;
}

export function playPause() {
    if (!initialized) initAudio();
    if (playing === false) {
        audio.play();
        playing = true;
    } else {
        audio.pause();
        playing = false;
    }
}

export function setRate(value) {
    audio.playbackRate = value;
}
export function setVolume(value) {
    audio.volume=value;
}

export function changeMedia(value) {
    audioSource.src = "media/" + value;
    audio.load();
    console.log("Source: " + value)
}

export function getFrequencyData() {
    if (initialized) analyser.getByteFrequencyData(frequencyData);
    else frequencyData = new Uint8Array(bufferLength);
}

export const lowRange = new Range(0, 0.2);
export const midRang = new Range(0.2, 0.4);
export const highRange = new Range(0.45, 0.6);