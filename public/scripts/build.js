const renderService = new RenderService();

function onSongUpload(event) {
    if (event?.files && event.files[0]) {
        renderService.updateSong(URL.createObjectURL(event.files[0]));
    }
}

// Control Panel
const pane = new Tweakpane.Pane({ container: document.getElementById('tweakpane'), title: 'Parameters' });
const changeHandler = (name) => change => renderService.updateParameter(name, change.value);

// Song Tab
const songFolder = pane.addFolder({ title: 'Song' });
const SONG = {
    Preset: renderService.parameters.songPath,
    preset_options: {
        'SICKO MODE - Travis Scott': '/songs/SICKO MODE - Travis Scott.mp3',
        'They Said - Tre Wright': '/songs/They Said - Tre Wright.mp3'
    }
};

songFolder.addInput(SONG, 'Preset', { options: SONG.preset_options }).on('change', change => renderService.updateSong(change.value));
songFolder.addButton({ title: 'Upload', label: 'Custom' }).on('click', () => document.getElementById('songInput').click());

// Customization Tab
const customizationFolder = pane.addFolder({ title: 'Customization' });
const CUSTOMIZATION = {
    'Sphere Color': renderService.parameters.sphereColor,
    'Sphere Detail': renderService.parameters.sphereDetail,
    'Rotation Speed': renderService.parameters.rotationSpeed,
    'Treble Amplitude': renderService.parameters.trebleAmplitude,
    'Bass Amplitude': renderService.parameters.bassAmplitude,
};

customizationFolder.addInput(CUSTOMIZATION, 'Sphere Color').on('change', changeHandler('sphereColor'));
customizationFolder.addInput(CUSTOMIZATION, 'Sphere Detail', { min: 1, max: 12, step: 1 }).on('change', changeHandler('sphereDetail'));
customizationFolder.addInput(CUSTOMIZATION, 'Rotation Speed', { min: 0, max: 50 }).on('change', changeHandler('rotationSpeed'));
customizationFolder.addInput(CUSTOMIZATION, 'Treble Amplitude', { min: 0, max: 3 }).on('change', changeHandler('trebleAmplitude'));
customizationFolder.addInput(CUSTOMIZATION, 'Bass Amplitude', { min: 0, max: 3 }).on('change', changeHandler('bassAmplitude'));

// Playback Tab
const playbackFolder = pane.addFolder({ title: 'Playback' });
const PLAYBACK = {
    'Volume': renderService.parameters.volume
};

playbackFolder.addButton({ title: 'Play' }).on('click', () => renderService.togglePlaying());
playbackFolder.addInput(PLAYBACK, 'Volume', { min: 0, max: 100, step: 1 }).on('change', change => renderService.changeVolume(change.value));
