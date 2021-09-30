const renderService = new RenderService();
const pane = new Tweakpane.Pane({ container: document.getElementById('tweakpane'), title: 'Parameters' });

// Song
const songFolder = pane.addFolder({ title: 'Song' });
const SONG = {
    preset: 0,
    preset_options: {
        'They Said - Tre Wright': 0
    }
};

songFolder.addInput(SONG, 'preset', { options: SONG.preset_options });
songFolder.addButton({ title: 'Upload', label: 'custom' });

// Customization
const customizationFolder = pane.addFolder({ title: 'Customization' });
const CUSTOMIZATION = {
    color: '#0f0',
    detail: 8,
    speed: 5,
    'treble-boost': 1
};

customizationFolder.addInput(CUSTOMIZATION, 'color');
customizationFolder.addInput(CUSTOMIZATION, 'detail', { min: 1, max: 16 });
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
