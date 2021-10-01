const renderService = new RenderService();

coverElement = document.getElementById('cover');
coverElement.onclick = closePopup;
popupElement = document.getElementById('popup');

function closePopup() {
    coverElement.classList.add('closed');
    popupElement.classList.add('closed');
}

function onSongUpload(event) {
    if (event?.files && event.files[0]) {
        const songSelect = document.getElementsByTagName('select')[0];
        songSelect.value = 'null';
        songSelect.dispatchEvent(new Event('change'));
        renderService.changeSong(URL.createObjectURL(event.files[0]));
        document.getElementById('songInput').value = "";
    }
}

// Control Panel
const pane = new Tweakpane.Pane({ container: document.getElementById('tweakpane'), title: 'Parameters' });
const changeHandler = (name) => change => renderService.changeParameter(name, change.value);

// Song Tab
const songFolder = pane.addFolder({ title: 'Song' });
const SONG = {
    Preset: renderService.parameters.songPath,
    preset_options: {
        'None': 'null',
        'SICKO MODE - Travis Scott': '/songs/SICKO MODE - Travis Scott.mp3',
        'ZEZE - Kodak Black': '/songs/ZEZE - Kodak Black.mp3',
        'INDUSTRY BABY - Lil Nas X': '/songs/INDUSTRY BABY - Lil Nas X.mp3'
    }
};

songFolder.addInput(SONG, 'Preset', { options: SONG.preset_options }).on('change', change => renderService.changeSong(change.value));
songFolder.addButton({ title: 'Upload', label: 'Custom' }).on('click', () => document.getElementById('songInput').click());

// Customization Tab
const customizationFolder = pane.addFolder({ title: 'Customization' });
const CUSTOMIZATION = {
    'Sphere Color': renderService.parameters.sphereColor,
    'Sphere Gradient': renderService.parameters.sphereGradient,
    'Sphere Detail': renderService.parameters.sphereDetail,
    'Rotation Speed': renderService.parameters.rotationSpeed,
    'Treble Amplitude': renderService.parameters.trebleAmplitude,
    'Bass Amplitude': renderService.parameters.bassAmplitude,
};

customizationFolder.addInput(CUSTOMIZATION, 'Sphere Color').on('change', changeHandler('sphereColor'));
customizationFolder.addInput(CUSTOMIZATION, 'Sphere Gradient').on('change', changeHandler('sphereGradient'))
customizationFolder.addInput(CUSTOMIZATION, 'Sphere Detail', { min: 1, max: 16, step: 1 }).on('change', changeHandler('sphereDetail'));
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
