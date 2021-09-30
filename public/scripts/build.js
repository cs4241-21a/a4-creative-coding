const renderService = new RenderService();
const pane = new Tweakpane.Pane({ container: document.getElementById('tweakpane'), title: 'Parameters' });

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
    speed: 5,
    'treble-boost': 1
};

customizationFolder.addInput(CUSTOMIZATION, 'Sphere Color')
    .on('change', color => renderService.updateSphereColor(color.value));
customizationFolder.addInput(CUSTOMIZATION, 'Sphere Detail', { min: 1, max: 12, step: 1 })
    .on('change', detail => renderService.updateSphereDetail(detail.value));
customizationFolder.addInput(CUSTOMIZATION, 'speed', { min: 1, max: 10 });
customizationFolder.addInput(CUSTOMIZATION, 'treble-boost', { min: 1, max: 5 });

// Playback
const playbackFolder = pane.addFolder({ title: 'Playback' });

playbackFolder.addButton({ title: 'Play' }).on('click', () => renderService.togglePlaying());
playbackFolder.addBlade({
    view: 'slider',
    min: 0,
    max: 1
});
