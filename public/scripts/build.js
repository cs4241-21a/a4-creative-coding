const renderService = new RenderService();
const pane = new Tweakpane.Pane({ container: document.getElementById('tweakpane'), title: 'Parameters' });

const changeHandler = (name) => change => renderService.updateParameter(name, change.value);

// Song
const songFolder = pane.addFolder({ title: 'Song' });
const SONG = {
    Preset: renderService.parameters.song,
    preset_options: {
        'They Said - Tre Wright': 'TheySaid'
    }
};

songFolder.addInput(SONG, 'Preset', { options: SONG.preset_options });
songFolder.addButton({ title: 'Upload', label: 'custom' });

// Customization
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
customizationFolder.addInput(CUSTOMIZATION, 'Rotation Speed', { min: 0, max: 20 }).on('change', changeHandler('rotationSpeed'));
customizationFolder.addInput(CUSTOMIZATION, 'Treble Amplitude', { min: 0, max: 3 }).on('change', changeHandler('trebleAmplitude'));
customizationFolder.addInput(CUSTOMIZATION, 'Bass Amplitude', { min: 0, max: 3 }).on('change', changeHandler('bassAmplitude'));

// Playback
const playbackFolder = pane.addFolder({ title: 'Playback' });

playbackFolder.addButton({ title: 'Play' }).on('click', () => renderService.togglePlaying());
playbackFolder.addBlade({
    view: 'slider',
    min: 0,
    max: 1
});
