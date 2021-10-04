import {Background, Bar, circleRow, setColor, setPulse} from "../visual.js";
import {setRate, setVolume, changeMedia, playPause, lowRange, midRang, highRange} from "../media/audio.js";

let options = {
    Track: 'Wildflower.mp3',
    Play_Pause: function () {
        playPause();
    },
    rate: 1,
    volume: 0.2,
    pulse: 0.2,
    noiseStrength: 10.2,
    growthSpeed: 0.2,
    treble: [146, 180, 214],
    mid: [0, 128, 255],
    bass: [231, 115, 23],
};

function setTrebleColor(value) {
    setColor(1, value)
}

function setMidColor(value) {
    setColor(2, value)
}

function setBassColor(value) {
    setColor(3, value)
}

export function buildGUI() {
    let gui = new dat.GUI();
    gui.remember(options);
    const mediaController = gui.add(options, 'Track', ['エスケープ ～次元の狭間オメガ：アルファ編～.mp3', 'Survivor.mp3', 'Wildflower.mp3']);
    gui.add(options, 'Play_Pause').name("Play/Pause");
    const rateSlider = gui.add(options, 'rate').min(0).max(1).step(0.1).name("Playback Speed");
    const volume = gui.add(options, 'volume').min(0).max(1).step(0.1).name("Volume");
    const pulseController = gui.add(options, 'pulse').min(0).max(0.5).step(0.05).name("Pulse");
    const f1 = gui.addFolder('Colors');
    const trebleColor = f1.addColor(options, 'treble').name("Treble");
    const midColor = f1.addColor(options, 'mid').name("Mid");
    const bassColor = f1.addColor(options, 'bass').name("Base");

    trebleColor.onChange(setTrebleColor);
    midColor.onChange(setMidColor);
    bassColor.onChange(setBassColor);
    mediaController.onChange(changeMedia);
    rateSlider.onChange(setRate);
    volume.onChange(setVolume);
    pulseController.onChange(setPulse);

    setTrebleColor(options['treble']);
    setMidColor(options['mid']);
    setBassColor(options['bass']);
    changeMedia(options['Track']);
}

function initVisual() {
    Background();
    circleRow(3, 100, 0.2, highRange, 1);
    circleRow(2, 125, 0.6, midRang, 2);
    Bar(lowRange, 3);
}

initVisual();
