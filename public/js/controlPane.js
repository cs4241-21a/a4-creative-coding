const pane = new Tweakpane.Pane({title: 'Control the Visualizer'});
var freqMult = 1;
var freqColor=`rgb(255,0,0)`
var backColor = `rgb(0,0,0)`
const audioContext = new AudioContext();
const audioElement = document.querySelector('#music')
const mediaPlayer = audioContext.createMediaElementSource(audioElement)
mediaPlayer.connect(audioContext.destination)
audioElement.volume = .15

const playBtn = pane.addButton({
    title: "Play"
})
pane.addSeparator();
pane.addInput({ volume: 0.15 }, 'volume', {
    min: 0,
    max: 1,
}).on('change', (ev) => {
    audioElement.volume = ev.value
});

pane.addInput({ song: 'WROR-FM (LIVE)' }, 'song', {
    options: {
        'WROR-FM (LIVE)': 'https://22063.live.streamtheworld.com/WRORFM.mp3',
        'Dream War': 'music/DreamWar.opus',
        'Worlds End': 'music/WorldsEnd.opus',
        'Silent Voyage': 'music/SilentVoyage.opus',
        'Dream War': 'music/DreamWar.opus'
    }
}).on('change', (ev) => {
    audioElement.src = ev.value
    if (playing) {
        playBtn.title = 'Play'
        playing = false
    }
});

pane.addInput({
    'frequency color': 'rgb(255, 0, 0)'
}, 'frequency color').on('change', (ev) => {
    freqColor = ev.value
});

pane.addInput({
    'background color': 'rgb(0, 0, 0)'
}, 'background color').on('change', (ev) => {
    backColor = ev.value
});

pane.addInput({ 'frequency multiplier': 1 }, 'frequency multiplier', {
    min: 0,
    max: 10,
}).on('change', (ev) => {
    freqMult = ev.value
});

pane.addInput({ 'canvas height': document.getElementById('canvas').height }, 'canvas height', {
    min: 100,
    max: window.innerHeight,
}).on('change', (ev) => {
    document.getElementById('canvas').height = ev.value;
});

pane.addInput({ 'canvas width': document.getElementById('canvas').width }, 'canvas width', {
    min: 100,
    max: window.innerWidth,
}).on('change', (ev) => {
    document.getElementById('canvas').width = ev.value;
});

let playing = false;
playBtn.on('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    if (playing) {
        playing = false
        audioElement.pause();
        playBtn.title = 'Play'

    }
    else {
        audioElement.play();
        playing = true
        playBtn.title = 'Pause'
        VisualizeSong()
    }
});