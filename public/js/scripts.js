// a4-creative-coding
// Music Maker
// by David Mahany
//
// This code is not particularly good, and I know the rendering performance could
//   be better if it used batches more but that would make the code even worse so whatever

let mainCanvas = document.querySelector("#mainCanvas");

// init render options

let renderOptions = {
    noteHeight: 20,
    measureWidth: 160,
};
renderOptions.refresh = () => {
    renderPane.refresh();
    updateCanvasSize();
};

{
    const pane = new Tweakpane.Pane({
        title: "Render Options",
    });
    pane.element.parentElement.style.width = "300px";
    
    const noteHeight_input = pane.addInput(
        renderOptions, 'noteHeight', {
            step: 1,
            min: 10,
            max: 40,
        }
    );
    noteHeight_input.on('change', function(ev) {
        renderOptions.noteHeight = ev.value;
        renderOptions.refresh();
        cacheSettings();
    });
    
    const measureWidth_input = pane.addInput(
        renderOptions, 'measureWidth', {
            step: 10,
            min: 40,
            max: 640,
        }
    );
    measureWidth_input.on('change', function(ev) {
        renderOptions.measureWidth = ev.value;
        renderOptions.refresh();
        cacheSettings();
    });
    window.renderPane = pane;
}

// init global song object

let song = {
    instr: [
        {
            notes: [],
        }
    ],
    measures: 16,
    bpm: 120,
};

// globals

const NUM_OCTAVES = 8;

let volume = 0.4;
let selectedInstr = 0;
let mousePos = null;
let snap = 0.25;
let drawingStart = null;
let areaSelectStart = null;
let previewNote = null;
let selectedNotes = [];
let removeNotes = [];

const MAX_UNDO_HISTORY = 100;
let undoHistory = [];
let redoHistory = [];

let fps = 0;
let frames = 0;
let lastFpsTime = 0;
let focusTime = 0;

// init the AudioContext used for note placement preview noise and to load the drum samples

let context = new AudioContext();
context.gainNode = context.createGain();
context.gainNode.gain.value = Math.pow(volume / 5.0, 1.5);
context.gainNode.connect(context.destination);

let drums = {};
fetch("assets/ORG_D00.wav")
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer))
    .then(buf => drums.d_kick = buf);
fetch("assets/ORG_D01.wav")
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer))
    .then(buf => drums.d_snare = buf);
fetch("assets/ORG_D02.wav")
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer))
    .then(buf => drums.d_hat = buf);
fetch("assets/ORG_D03.wav")
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer))
    .then(buf => drums.d_ride = buf);
fetch("assets/ORG_D04.wav")
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer))
    .then(buf => drums.d_fall = buf);
fetch("assets/ORG_D05.wav")
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer))
    .then(buf => drums.d_bell = buf);

// set up song options panel

{
    const pane = new Tweakpane.Pane({
        title: "Song Options",
    });
    pane.element.parentElement.style.width = "300px";
    pane.element.parentElement.style.right = "320px";
    
    let PARAMS = {
        bpm: song.bpm,
        measures: song.measures,
    }

    const bpm_input = pane.addInput(
        PARAMS, 'bpm', {
            step: 1,
            min: 60,
            max: 240,
        }
    );
    bpm_input.on('change', function(ev) {
        song.bpm = ev.value;
    });
    
    const measures_input = pane.addInput(
        PARAMS, 'measures', {
            step: 1,
            min: 1,
            max: 64,
        }
    );
    measures_input.on('change', function(ev) {
        song.measures = ev.value;
        renderOptions.refresh();
    });
    window.songPane = pane;
    window.songPane.params = PARAMS;
}

// set up editing options panel

{
    const pane = new Tweakpane.Pane({
        title: "Editing Options",
    });
    pane.element.parentElement.style.width = "300px";
    pane.element.parentElement.style.right = "640px";
    
    const PARAMS = {
        snap: 1/4,
        volume: volume,
    }

    const snap_input = pane.addInput(
        PARAMS, 'snap',
        {
            options: {
                "1": 1,
                "2": 1/2,
                "3": 1/3,
                "4": 1/4,
                "6": 1/6,
                "8": 1/8,
                "12": 1/12,
                "16": 1/16,
                "24": 1/24,
                "32": 1/32,
            }
        },
    );
    snap_input.on('change', function(ev) {
        snap = ev.value;
        cacheSettings();
    });

    const volume_input = pane.addInput(
        PARAMS, 'volume', {
            step: 0.01,
            min: 0,
            max: 1.0,
        }
    );
    volume_input.on('change', function(ev) {
        if(player.gainNode) {
            player.gainNode.gain.value = Math.pow(ev.value / 5.0, 1.5);
            context.gainNode.gain.value = Math.pow(ev.value / 5.0, 1.5);
        }
        volume = ev.value;
        cacheSettings();
    });

    window.editPane = pane;
    window.editPane.params = PARAMS;
}

/**
 * Sets the instrument at index i to be the active instrument.
 * If desired, the cache parameter can be set to false to disable saving settings to cache this time (used in startup).
 */
function selectInstr(i, cache=true) {
    selectedInstr = i;
    populateLeft();
    if(cache) cacheSettings();
}

/**
 * Saves the current song to localStorage and updates the URL with the song code if it's short enough.
 */
function updateURL() {
    const str = JSONCrush.crush(JSON.stringify(minifySong()));
    if(str.length < 1800) {
        window.history.replaceState({}, null, location.protocol + '//' + location.host + location.pathname + "?s=" + str);
    }else{
        window.history.replaceState({}, null, location.protocol + '//' + location.host + location.pathname);
    }
    localStorage["song"] = str;
}

/**
 * Saves the song to localStorage, updates the URL and caches settings.
 */
function save(){
    updateURL();
    cacheSettings();
}

/**
 * Save settings to localStorage.
 */
function cacheSettings(){
    localStorage["renderOptions"] = JSON.stringify(renderOptions);
    localStorage["selectedInstr"] = selectedInstr;
    localStorage["snap"] = snap;
    localStorage["volume"] = volume;
}

/**
 * Loads the song from URL or localStorage, and loads settings from localStorage.
 */
function load(){
    let minSong = new URL(location).searchParams.get("s") || localStorage["song"];
    if(minSong) {
        song = unminifySong(JSON.parse(JSONCrush.uncrush(minSong)));
    }

    if(localStorage["renderOptions"] !== undefined) {
        let pr = JSON.parse(localStorage["renderOptions"]);
        for(var k in pr) renderOptions[k] = pr[k];
    }

    if(localStorage["selectedInstr"] !== undefined) selectInstr(parseInt(localStorage["selectedInstr"]), false);
    if(localStorage["snap"] !== undefined) snap = parseFloat(localStorage["snap"]); 
    
    if(localStorage["volume"] !== undefined) volume = parseFloat(localStorage["volume"]);
    
    refreshUI();
}

/**
 * Updates and refreshes some Tweakpane variables.
 */
function refreshUI(){
    window.editPane.params.snap = snap;
    window.editPane.params.volume = volume;
    window.editPane.refresh();

    window.songPane.params.bpm = song.bpm;
    window.songPane.params.measures = song.measures;
    window.songPane.refresh();
}

/**
 * Converts the current song object into a more compact form.
 */
function minifySong(){
    let s = {m: song.measures, b: song.bpm, i:[]};
    for(let ii = 0; ii < song.instr.length; ii++){
        let ins = {m: song.instr[ii].name, t: song.instr[ii].type, v: song.instr[ii].volume, n: []};
        for(let ni = 0; ni < song.instr[ii].notes.length; ni++){
            ins.n.push(song.instr[ii].notes[ni].pos);
            ins.n.push(song.instr[ii].notes[ni].len);
            ins.n.push(song.instr[ii].notes[ni].tone);
        }
        s.i[ii] = ins;
    }
    return s;
}

/**
 * Inverse of the minifySong function.
 */
function unminifySong(s) {
    let song = {measures: s.m, bpm: s.b, instr: []};
    for(let ii = 0; ii < s.i.length; ii++){
        let ins = {name: s.i[ii].m, type: s.i[ii].t, volume: s.i[ii].v, notes: []};
        for(let ni = 0; ni < s.i[ii].n.length; ni += 3){
            ins.notes.push({
                pos: s.i[ii].n[ni + 0],
                len: s.i[ii].n[ni + 1],
                tone: s.i[ii].n[ni + 2],
            });
        }
        song.instr[ii] = ins;
    }

    return song;
}

/**
 * Pushes the current state to the undo stack.
 * @returns false if the user canceled the action when prompted due to the redo history needing to be reset, true otherwise (iow: true if the state was saved, false if not).
 */
function pushHistory(){
    if(redoHistory.length > 4) {
        if(!confirm("WARNING: this operation will remove " + redoHistory.length + " operations from the redo history! Proceed?")){
            return false;
        }
    }

    undoHistory.push(JSON.parse(JSON.stringify({song, selectedNotes})));
    undoHistory = undoHistory.slice(-MAX_UNDO_HISTORY);
    redoHistory = [];

    return true;
}

/**
 * Pop the undo stack and push the previous state onto the redo stack.
 */
function undo(){
    if(undoHistory.length > 0){
        redoHistory.push(JSON.parse(JSON.stringify({song, selectedNotes})));
        let pop = undoHistory.pop();
        song = pop.song;
        selectedNotes = pop.selectedNotes;
    }
}

/**
 * Pop the redo stack and push the previous state onto the undo stack.
 */
function redo(){
    if(redoHistory.length > 0){
        undoHistory.push(JSON.parse(JSON.stringify({song, selectedNotes})));
        let pop = redoHistory.pop();
        song = pop.song;
        selectedNotes = pop.selectedNotes;
    }
}

/**
 * @returns An object containing info about the mouse coordinates, hovered note position, and hovered tone, or null if the mouse is not on the canvas.
 */
function getMousePos() {
    if(mousePos === null) return null;
    
    let hoverPos      = mousePos && (mousePos.x / renderOptions.measureWidth);
    let hoverPosLeft  = mousePos && (mousePos.x / renderOptions.measureWidth);
    let hoverPosRight = mousePos && (mousePos.x / renderOptions.measureWidth);
    if(snap !== null && hoverPosLeft !== null) {
        hoverPosLeft = Math.floor(hoverPosLeft / snap) * snap;
        hoverPosRight = Math.ceil(hoverPosRight / snap) * snap;
    }
    let hoverTone = mousePos && Math.floor((mainCanvas.height - mousePos.y) / renderOptions.noteHeight);

    return {
        x: mousePos.x,
        y: mousePos.y,
        posRaw: hoverPos,
        posL: hoverPosLeft,
        posR: hoverPosRight,
        tone: hoverTone,
    };
}

/**
 * Checks if a note would overlap any preexisting notes on the same instrument.
 * @param newNote The note to check
 * @returns The index into song.instr[selectedInstr].notes of the first overlapping note found, -1 if there is no overlap.
 */
function checkOverlap(newNote) {
    return song.instr[selectedInstr].notes.findIndex(n => n.tone == newNote.tone && n.pos < newNote.pos + newNote.len && newNote.pos < n.pos + n.len);
}

/**
 * Updates the canvas size and resolution to match the total notes height and song length.
 */
function updateCanvasSize() {
    mainCanvas.style.height = mainCanvas.height = renderOptions.noteHeight * 12 * NUM_OCTAVES;
    mainCanvas.style.width = mainCanvas.width = Math.max(renderOptions.measureWidth * song.measures, mainCanvas.parentElement.clientWidth);
    if(mainCanvas.parentElement.scrollTop == 0) mainCanvas.parentElement.scrollTop = 600; // scroll down if at top (the idea is that the default scroll is halfwayish down)
}

/**
 * Clears and rebuilds the left panel contents to match the current state.
 */
function populateLeft() {
    let left = document.querySelector("#left");
    left.innerHTML = '';
    
    for(let i = 0; i < song.instr.length; i++) {
        let ins = song.instr[i];
        let el = document.createElement("div");
        el.innerText = ins.name || ("Instr " + i);
        if(i === selectedInstr) {
            el.classList.add("selected");
        }
        el.onclick = e => {
            if(e.button == 0) {
                selectInstr(i);
            }
        };
        el.oncontextmenu = e => {
            e.preventDefault();
            const pane = new Tweakpane.Pane();
            const PARAMS = {
                name: ins.name || "",
                type: ins.type || "square",
                volume: ins.volume || 0.8,
            };

            const name_input = pane.addInput(
                PARAMS, 'name'
            );
            name_input.on('change', function(ev) {
                ins.name = ev.value;
                populateLeft();
            });

            const type_input = pane.addInput(
                PARAMS, 'type',
                {options: {
                    sine: 'sine', 
                    triangle: 'triangle', 
                    square: 'square', 
                    saw: 'sawtooth',
                    kick: 'd_kick',
                    snare: 'd_snare',
                    hat: 'd_hat',
                    ride: 'd_ride',
                    fall: 'd_fall',
                    bell: 'd_bell',
                }}
            );
            type_input.on('change', function(ev) {
                ins.type = ev.value;
                populateLeft();
            });

            const volume_input = pane.addInput(
                PARAMS, 'volume', {
                    step: 0.05,
                    min: 0.0,
                    max: 1.0,
                }
            );
            volume_input.on('change', function(ev) {
                ins.volume = ev.value;
            });

            const del_btn = pane.addButton({
                title: '[X] Delete',
            });

            pane.element.parentElement.style.left = e.clientX + "px";
            pane.element.parentElement.style.top = e.clientY + "px";

            pane.element.parentElement.tabIndex = 0;
            pane.element.parentElement.focus();

            let iv = setInterval(() => {
                if(!pane.element.parentElement.contains(document.activeElement)) {
                    pane.dispose();
                    clearInterval(iv);
                }
            }, 100);
            
            del_btn.on('click', () => {
                if(pushHistory()) {
                    song.instr.splice(i, 1);
                    populateLeft();
                    pane.dispose();
                    clearInterval(iv);
                }
            });

        }
        left.appendChild(el);
    }

    let el = document.createElement("div");
    el.innerText = "+";
    el.classList.add("add");
    el.onclick = e => {
        song.instr.push({
            notes: [],
            name: "Instr " + song.instr.length,
            type: "square",
        })
        populateLeft();
    };
    left.appendChild(el);
}

/**
 * Calculates the y position offset for a given tone.
 */
function getNoteOffset(tone) {
    return (tone + 1) * renderOptions.noteHeight;
}

// set up the non-selected note pattern (diagonal striped pattern)

let pattern = document.createElement('canvas');
let pctx = pattern.getContext('2d');
pattern.width = 10;
pattern.height = 10;

let notePatterns = [];
let notePatternsLight = [];

/**
 * Fetches the non-selected note pattern for a given hue if available, otherwise it is created and cached for future calls.
 * @param {*} hue The desired hue
 * @param {*} light Optional; set to true for a lighter color (used for showing a note is currently playing)
 * @returns The pattern
 */
function notePattern(hue, light=false){
    let storage = light ? notePatternsLight : notePatterns;
    if(storage[hue] !== undefined) {
        return storage[hue];
    }

    pctx.clearRect(0,0,pattern.width,pattern.height);

    pctx.lineWidth = 4;
    pctx.strokeStyle = "hsla(" + hue + ", 100%, " + (light ? "90" : "70") + "%, " + (light ? "0.6" : "0.5") + ")";
    pctx.beginPath();
    for(let x = -1; x < 2; x++){
        for(let y = -1; y < 2; y++){
            pctx.moveTo(-1 + 10*x, -1 + 10*y);
            pctx.lineTo(11 + 10*x, 11 + 10*y);
        }
    }
    pctx.stroke();
    let pat = mainCanvas.getContext("2d").createPattern(pattern,'repeat');
    storage[hue] = pat;

    return pat;
}

/**
 * Renders and updates the canvas. Queues another requestAnimationFrame of itself at the end.
 * @param {*} time Current time in ms (automatically passed by requestAnimationFrame)
 */
function frame(time) {

    if(player.isPlaying()){
        let measuresPerSecond = song.bpm / 4 / 60;
        let nowTime = player.audioContext.currentTime;
        let nowPos = (nowTime * measuresPerSecond) % song.measures;
        // if(nowPos * renderOptions.measureWidth > view.x + view.w) {
        //     mainCanvas.parentElement.scrollBy(nowPos * renderOptions.measureWidth - view.x - renderOptions.measureWidth, 0);
        // }
        mainCanvas.parentElement.scrollLeft = Math.floor(nowPos - 1) * renderOptions.measureWidth;
    }

    let cx = mainCanvas.getContext("2d");

    const view = {
        x: mainCanvas.parentElement.scrollLeft,
        y: mainCanvas.parentElement.scrollTop,
        w: mainCanvas.parentElement.clientWidth,
        h: mainCanvas.parentElement.clientHeight
    }

    cx.fillStyle = "#222";
    cx.fillRect(view.x, view.y, view.w, view.h);

    let mouse = getMousePos();

    // draw measure bottom
    cx.beginPath();
    cx.strokeStyle = "#fff";
    for(let m = 0; m * renderOptions.measureWidth < mainCanvas.width; m++){
        cx.moveTo(m * renderOptions.measureWidth + 0.5, 0);
        cx.lineTo(m * renderOptions.measureWidth + 0.5, mainCanvas.height);
    }
    cx.stroke();

    cx.beginPath();
    cx.strokeStyle = "#888";
    for(let m = 0; m * renderOptions.measureWidth < mainCanvas.width; m++){
        cx.moveTo((m + 0.25) * renderOptions.measureWidth + 0.5, 0);
        cx.lineTo((m + 0.25) * renderOptions.measureWidth + 0.5, mainCanvas.height);
        cx.moveTo((m + 0.5) * renderOptions.measureWidth + 0.5, 0);
        cx.lineTo((m + 0.5) * renderOptions.measureWidth + 0.5, mainCanvas.height);
        cx.moveTo((m + 0.75) * renderOptions.measureWidth + 0.5, 0);
        cx.lineTo((m + 0.75) * renderOptions.measureWidth + 0.5, mainCanvas.height);
    }
    cx.stroke();

    // draw note/keys background
    cx.font = "bold 14px Arial";
    for(let o = 0; o < NUM_OCTAVES; o++){
        for(let n = 0; n < 12; n++) {
            let y = mainCanvas.height - getNoteOffset(n + 12 * o);
            cx.fillStyle = n % 2 == (n > 4 ? 1 : 0) ? "#555" : "#333";
            cx.fillRect(view.x, y, view.w, renderOptions.noteHeight - 2);

            if(n == 0){
                cx.fillStyle = "#fff";
                cx.fillText("C" + o, mainCanvas.parentElement.scrollLeft + 6, y + renderOptions.noteHeight - 5);
            }
        }
    }

    // draw notes

    //   non-selected
    for(let i = 0; i < song.instr.length; i++) {
        if(selectedInstr === i) continue;

        const inst = song.instr[i];
        for(let j = 0; j < inst.notes.length; j++) {
            const n = inst.notes[j];
            let y = mainCanvas.height - getNoteOffset(n.tone);

            cx.fillStyle = notePattern(i * 40 + 15);
            cx.strokeStyle = "hsla(" + (i * 40 + 15) + ", 100%, 70%, 0.5)";
            if(player.isPlaying()){
                let measuresPerSecond = song.bpm / 4 / 60;
                let nowTime = player.audioContext.currentTime;
                let nowPos = (nowTime * measuresPerSecond) % song.measures;

                if(nowPos >= n.pos && nowPos < n.pos + n.len){
                    cx.fillStyle = notePattern(i * 40 + 15, true);
                    cx.strokeStyle = "hsla(" + (i * 40 + 15) + ", 100%, 85%, 0.5)";
                }
            }

            cx.fillRect(n.pos * renderOptions.measureWidth + 1, y + 3, n.len * renderOptions.measureWidth - 2, renderOptions.noteHeight - 8);
            cx.strokeRect(n.pos * renderOptions.measureWidth + 1, y + 2, n.len * renderOptions.measureWidth - 2, renderOptions.noteHeight - 6);
        }
    }

    //   selected
    for(let i = 0; i < song.instr.length; i++) {
        if(selectedInstr !== i) continue;

        const inst = song.instr[i];
        for(let j = 0; j < inst.notes.length; j++) {
            const n = inst.notes[j];
            let y = mainCanvas.height - getNoteOffset(n.tone);
            cx.fillStyle = "hsl(" + (i * 40 + 15) + ", 100%, 70%)";
            if(player.isPlaying()){
                let measuresPerSecond = song.bpm / 4 / 60;
                let nowTime = player.audioContext.currentTime;
                let nowPos = (nowTime * measuresPerSecond) % song.measures;

                if(nowPos >= n.pos && nowPos < n.pos + n.len){
                    cx.fillStyle = "hsl(" + (i * 40 + 15) + ", 100%, 85%)";
                }
            }
            cx.fillRect(n.pos * renderOptions.measureWidth, y + 2, n.len * renderOptions.measureWidth, renderOptions.noteHeight - 6);

            if(selectedNotes.includes(j) || (mouse && mouse.tone === n.tone && mouse.posRaw >= n.pos && mouse.posRaw < n.pos + n.len)) {
                cx.strokeStyle = "hsl(" + (i * 40 + 180 + 15) + ", 100%, 70%)";
                cx.strokeRect(n.pos * renderOptions.measureWidth, y + 2, n.len * renderOptions.measureWidth, renderOptions.noteHeight - 6);
            }

            if(removeNotes.includes(j)) {
                cx.strokeStyle = "red";
                cx.strokeRect(n.pos * renderOptions.measureWidth, y + 2, n.len * renderOptions.measureWidth, renderOptions.noteHeight - 6);
            }
        }
    }

    // drawing
    if(drawingStart !== null && selectedInstr !== null) {
        let end = getMousePos();
        const inst = song.instr[selectedInstr];
        cx.fillStyle = "hsl(" + (selectedInstr * 40 + 15) + ", 100%, 70%)";

        let pos = Math.min(end.posL, drawingStart.posL);
        let len = Math.max(Math.abs(end.posR - drawingStart.posL), Math.abs(end.posL - drawingStart.posR));
        let tone = drawingStart.tone;

        let overlap = checkOverlap({pos, len, tone});

        if(overlap !== -1){
            cx.fillStyle = "hsla(" + (selectedInstr * 40 + 15) + ", 100%, 70%, 0.5)";
        }
        let y = mainCanvas.height - getNoteOffset(tone);
        cx.fillRect(pos * renderOptions.measureWidth, y + 2, len * renderOptions.measureWidth, renderOptions.noteHeight - 6);
    }

    if(areaSelectStart !== null){
        cx.strokeStyle = "#2af";
        cx.fillStyle = "#2af2";
        let end = getMousePos();
        cx.fillRect(areaSelectStart.x, areaSelectStart.y, end.x - areaSelectStart.x, end.y - areaSelectStart.y);
        cx.strokeRect(areaSelectStart.x, areaSelectStart.y, end.x - areaSelectStart.x, end.y - areaSelectStart.y);
    }

    if(player.isPlaying()){
        let measuresPerSecond = song.bpm / 4 / 60;
        let nowTime = player.audioContext.currentTime;
        let nowPos = (nowTime * measuresPerSecond) % song.measures;
        cx.strokeStyle = "#fff";
        cx.beginPath();
        cx.moveTo(nowPos * renderOptions.measureWidth, view.y);
        cx.lineTo(nowPos * renderOptions.measureWidth, view.y + view.h);
        cx.stroke();
    }

    // draw measure top
    cx.font = "bold 14px Arial";
    for(let m = 0; m * renderOptions.measureWidth < mainCanvas.width; m++){
        cx.fillStyle = "#fff";
        cx.fillText("M" + m, m * renderOptions.measureWidth + 4, mainCanvas.parentElement.scrollTop + 14);

        if(m >= song.measures) {
            cx.fillStyle = "#0004"
            cx.fillRect(m * renderOptions.measureWidth, view.y, renderOptions.measureWidth, view.h);
        }
    }

    if(mouse !== null && areaSelectStart === null){
        cx.fillStyle = "#fff";
        cx.beginPath();
        const pad = 4;
        cx.moveTo(mouse.posL * renderOptions.measureWidth, mainCanvas.height - getNoteOffset(mouse.tone) + pad);
        cx.lineTo(mouse.posL * renderOptions.measureWidth + 4, mainCanvas.height - getNoteOffset(mouse.tone) + renderOptions.noteHeight/2)
        cx.lineTo(mouse.posL * renderOptions.measureWidth, mainCanvas.height - getNoteOffset(mouse.tone) + renderOptions.noteHeight - pad);
        cx.closePath();
        cx.fill();
    }

    cx.font = "bold 12px Arial";
    cx.fillStyle = "#000";
    cx.fillText("FPS: " + fps, mainCanvas.parentElement.scrollLeft + mainCanvas.parentElement.clientWidth - 60 + 1, mainCanvas.parentElement.scrollTop + 14 + 1);
    cx.fillStyle = "#0f0";
    cx.fillText("FPS: " + fps, mainCanvas.parentElement.scrollLeft + mainCanvas.parentElement.clientWidth - 60, mainCanvas.parentElement.scrollTop + 14);

    frames++;
    if(time - lastFpsTime > 1000) {
        lastFpsTime = time;
        fps = frames;
        frames = 0;
        // console.log(fps);
    }

    requestAnimationFrame(frame);
}

/**
 * Object containing the audio player state.
 * (this is kind of an inelegant way to do this but whatever)
 */
let player = {
    audioContext: null,
    timeout: null,
    lastTickTime: 0,
    outputNode: null,
    gainNode: null,

    /**
     * Starts playing the song.
     */
    start: () => {
        songPane.children[0].disabled = true;
        mainCanvas.parentElement.scrollLeft = 0;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        player.audioContext = new AudioContext();

        const gainNode = player.audioContext.createGain();
        gainNode.gain.value = Math.pow(volume / 5.0, 1.5);
        gainNode.connect(player.audioContext.destination);

        player.outputNode = gainNode;
        player.gainNode = gainNode;

        player.tick();

    },

    /**
     * Stops playing the song.
     */
    stop: () => {
        songPane.children[0].disabled = false;
        player.audioContext.close();
        player.audioContext = null;
        player.lastTickTime = 0;
        clearTimeout(player.timeout);
    },

    /**
     * @returns true if the song is playing, false if not.
     */
    isPlaying: () => {
        return player.audioContext !== null;
    },

    /**
     * Steps the player by adding webaudio nodes for upcoming notes.
     * This function calls setTimeout on itself at the end, which is canceled automatically by calling the stop function.
     */
    tick: () => {

        let measuresPerSecond = song.bpm / 4 / 60;

        let nowTime = player.audioContext.currentTime + 0.5;

        let startPos = player.lastTickTime * measuresPerSecond;
        let endPos = nowTime * measuresPerSecond;

        let loops = 0;
        while(endPos > song.measures) {
            startPos -= song.measures;
            endPos -= song.measures;
            loops++;
        }

        // console.log(startPos + " " + endPos);

        for(let ii = 0; ii < song.instr.length; ii++){
            let ins = song.instr[ii];
            for(let ni = 0; ni < ins.notes.length; ni++){
                let note = ins.notes[ni];
                if(note.pos >= startPos && note.pos < endPos){
                    let type = ins.type || 'square';

                    if(type.startsWith("d_")) {
                        const source = player.audioContext.createBufferSource();
                        const audioBuffer = drums[type];
                      
                        source.buffer = audioBuffer;
                        source.detune.setValueAtTime((note.tone - 45) * 100, note.pos / measuresPerSecond + (loops * (1/measuresPerSecond) * song.measures));

                        const gainNode = player.audioContext.createGain();
                        gainNode.gain.value = 2.0 * (ins.volume || 0.8);
                        gainNode.connect(player.outputNode);
                        source.connect(gainNode);

                        source.start(note.pos / measuresPerSecond + (loops * (1/measuresPerSecond) * song.measures));
                        source.stop((note.pos + note.len) / measuresPerSecond + (loops * (1/measuresPerSecond) * song.measures));
                    }else{
                        const oscillator = player.audioContext.createOscillator();
                        oscillator.type = type;
                        // see https://www.desmos.com/calculator/qgdwha0qdw
                        oscillator.frequency.setValueAtTime(16.35160 * Math.pow(Math.pow(2, 1/12), note.tone), note.pos / measuresPerSecond + (loops * (1/measuresPerSecond) * song.measures));
                        
                        const gainNode = player.audioContext.createGain();
                        gainNode.gain.value = ins.volume || 0.8;
                        gainNode.connect(player.outputNode);
                        oscillator.connect(gainNode);

                        // console.log(note.pos / measuresPerSecond + (loops * (1/measuresPerSecond) * song.measures) + " " + player.audioContext.currentTime);
                        oscillator.start(note.pos / measuresPerSecond + (loops * (1/measuresPerSecond) * song.measures));
                        oscillator.stop((note.pos + note.len) / measuresPerSecond + (loops * (1/measuresPerSecond) * song.measures));
                    }
                }
            }
        }

        player.lastTickTime = nowTime;

        player.timeout = setTimeout(player.tick, 1);
    }
}

// main function

window.onload = function() {
    // load cache and update UI
    load();
    renderOptions.refresh();
    populateLeft();

    // set up "Clear Cache" button
    document.querySelector("#clearButton").onclick = e => {
        localStorage.clear();
        location = location.protocol + '//' + location.host + location.pathname;
    };

    // set up "Enter Code" button
    document.querySelector("#enterButton").onclick = e => {
        let minSong = prompt("Enter song code:").replace("%01", "\u0001");
        song = unminifySong(JSON.parse(JSONCrush.uncrush(minSong)));
        populateLeft();
        updateURL();
        refreshUI();
    };

    // set up "Copy Code" button
    document.querySelector("#copyButton").onclick = e => {
        let minSong = JSONCrush.crush(JSON.stringify(minifySong()));
        prompt("Copy:", minSong);
    };

    // set up "Show Help" button
    document.querySelector("#helpButton").onclick = e => {
        showHelp();
    };

    // mouse movement handling
    mainCanvas.onmousemove = e => {
        // keep track of position
        let x = e.clientX - mainCanvas.getBoundingClientRect().x;
        let y = e.clientY - mainCanvas.getBoundingClientRect().y;
        mousePos = {x, y};

        // select notes for deletion when right click dragging
        if(e.buttons & 2) {
            let mouse = getMousePos();
            song.instr[selectedInstr].notes.forEach((n, i) => {
                if(mouse.tone === n.tone && mouse.posRaw >= n.pos && mouse.posRaw < n.pos + n.len) {
                    removeNotes.push(i);
                }
            });
        }
    };

    // reset some editing things when the mouse leaves the canvas
    mainCanvas.onmouseleave = e => {
        mousePos = null;
        drawingStart = null;
        areaSelectStart = null;

        if(previewNote != null) {
            previewNote.stop();
            previewNote = null;
        }
    }

    // handle mouse pressed
    mainCanvas.onmousedown = e => {
        // skip if the window just got focused (avoid accidental note placement)
        if(e.timeStamp < focusTime) {
            return;
        }

        if(e.button == 0) { // left mouse
            if(e.shiftKey){
                // start area select
                areaSelectStart = getMousePos();
            }else{
                // start drawing note
                drawingStart = getMousePos();

                // start preview sound
                const ins = song.instr[selectedInstr];
                let type = ins.type || 'square';
                let tone = drawingStart.tone;
                if(type.startsWith("d_")) {
                    const source = context.createBufferSource();
                    const audioBuffer = drums[type];
                  
                    source.buffer = audioBuffer;
                    source.detune.setValueAtTime((tone - 45) * 100, context.currentTime);

                    const gainNode = context.createGain();
                    gainNode.gain.value = 2.0 * (ins.volume || 0.8);
                    gainNode.connect(context.gainNode);
                    source.connect(gainNode);

                    source.start();
                    previewNote = source;
                }else{
                    const oscillator = context.createOscillator();
                    oscillator.type = type;
                    // see https://www.desmos.com/calculator/qgdwha0qdw
                    oscillator.frequency.setValueAtTime(16.35160 * Math.pow(Math.pow(2, 1/12), tone), context.currentTime);
                    
                    const gainNode = context.createGain();
                    gainNode.gain.value = ins.volume || 0.8;
                    gainNode.connect(context.gainNode);
                    oscillator.connect(gainNode);

                    oscillator.start();
                    previewNote = oscillator;
                }
            }
        }
    }

    // handle mouse release
    mainCanvas.onmouseup = e => {
        if(e.button == 0) { // left mouse
            // stop the preview note if any
            if(previewNote != null) {
                previewNote.stop();
                previewNote = null;
            }

            // if area selecting, select the notes and return early
            if(areaSelectStart !== null){
                let end = getMousePos();

                let start_pos = Math.min(end.posRaw, areaSelectStart.posRaw);
                let end_pos = Math.max(end.posRaw, areaSelectStart.posRaw);
                let start_tone = Math.min(end.tone, areaSelectStart.tone);
                let end_tone = Math.max(end.tone, areaSelectStart.tone);
                
                if(!e.shiftKey) selectedNotes = [];

                song.instr[selectedInstr].notes.forEach((n, i) => {
                    if(n.pos + n.len >= start_pos && n.pos <= end_pos) {
                        if(n.tone >= start_tone && n.tone <= end_tone) {
                            if(!selectedNotes.includes(i)){
                                selectedNotes.push(i);
                            }
                        }
                    }
                });

                areaSelectStart = null;
                return;
            }

            // the rest of the code here is for note drawing so return if not doing that
            if(drawingStart === null) return;

            // calculate new note position and length
            //   uses a bunch of min and max since end could be left or right of drawingStart
            let end = getMousePos();
            let pos = Math.min(end.posL, drawingStart.posL);
            let len = Math.max(Math.abs(end.posR - drawingStart.posL), Math.abs(end.posL - drawingStart.posR));

            let note = {
                pos,
                len,
                tone: drawingStart.tone
            };

            // check for overlap
            let overlap = checkOverlap(note);
            if(overlap === -1){
                // add the note only if no overlap and the history push went through
                if(pushHistory()){
                    song.instr[selectedInstr].notes.push(note);
                }
            }

            // reset state
            drawingStart = null;
        }else if(e.button == 2) { // right mouse
            // delete any notes that were right click dragged
            if(removeNotes.length > 0) {
                // only if the history push went through
                if(pushHistory()) {
                    song.instr[selectedInstr].notes = song.instr[selectedInstr].notes.filter((n, i) => !removeNotes.includes(i));
                    selectedNotes = [];
                    removeNotes = [];
                }
            }
        }
    }

    // handle mouse clicks
    mainCanvas.onclick = e => {
        // update mouse position
        let x = e.clientX - mainCanvas.getBoundingClientRect().x;
        let y = e.clientY - mainCanvas.getBoundingClientRect().y;
        mousePos = {x, y};

        if(e.button == 0) { // left mouse
            // handle note clicking selection
            let mouse = getMousePos();
            song.instr[selectedInstr].notes.forEach((n, i) => {
                if(mouse.tone === n.tone && mouse.posRaw >= n.pos && mouse.posRaw < n.pos + n.len) {
                    if(e.shiftKey){
                        if(selectedNotes.includes(i)){
                            selectedNotes.splice(selectedNotes.indexOf(i), 1);
                        }else{
                            selectedNotes.push(i);
                        }
                    }else{
                        if(selectedNotes.includes(i)){
                            selectedNotes = [];
                        }else{
                            selectedNotes = [i];
                        }
                    }
                }
            })
        }
    }

    // window-wide key press handling
    window.onkeydown = e => {
        
        // ignore key presses when focused on a text field
        if(e.target !== null && e.target.tagName === "INPUT") return;

        if(e.key == "z" && e.ctrlKey) {
            undo();
        }else if(e.key == "y" && e.ctrlKey) {
            redo();
        }else if(e.key == "Delete") {
            // delete selected notes if history push went through
            if(pushHistory()){
                song.instr[selectedInstr].notes = song.instr[selectedInstr].notes.filter((n, i) => !selectedNotes.includes(i));
                selectedNotes = [];
            }
        }else if(e.key == "a" && e.ctrlKey && e.target === mainCanvas) {
            // select all notes on Ctrl+A if focused on the canvas
            e.preventDefault(); // prevent selecting the whole page

            if(selectedNotes.length == song.instr[selectedInstr].notes.length) {
                selectedNotes = [];
            }else{
                selectedNotes = [...song.instr[selectedInstr].notes.keys()];
            }
        }else if(e.key == "s" && e.ctrlKey) {
            e.preventDefault(); // prevent saving the whole page to file

            save();
        }else if(e.key == " ") {
            e.preventDefault(); // prevent scrolling

            if(player.isPlaying()){
                player.stop();
            }else{
                player.start();
            }
        }else if(e.key == "ArrowUp") {
            e.preventDefault(); // prevent scrolling

            // select the instrument above the currently selected one
            if(selectedInstr > 0) {
                selectInstr(selectedInstr - 1);
                selectedNotes = [];
            }
        }else if(e.key == "ArrowDown") {
            e.preventDefault(); // prevent scrolling

            // select the instrument below the currently selected one
            if(selectedInstr < song.instr.length - 1) {
                selectInstr(selectedInstr + 1);
                selectedNotes = [];
            }
        }
    }

    // handle page resizing
    document.body.onresize = e => {
        updateCanvasSize();
    }

    // handle scrolling on the canvas
    mainCanvas.onwheel = e => {
        if(e.ctrlKey) { // Ctrl+mouse wheel adjusts measureWidth
            e.preventDefault(); // prevent default whole page zoom behavior

            if(e.wheelDeltaY < 0) { // I think you're supposed to check if its a notched or free wheel otherwise it's inconsistent but idc
                renderOptions.measureWidth /= 2;
            } else {
                renderOptions.measureWidth *= 2;
            }
            renderOptions.measureWidth = Math.max(40, Math.min(renderOptions.measureWidth, 640));
            renderOptions.refresh();
        }
    }

    // keep track of when the page got focus
    mainCanvas.onfocus = e => {
        focusTime = e.timeStamp;
    }

    // disable right click on the canvas
    mainCanvas.oncontextmenu = () => false;

    // show the help dialogue/tour on first page view (or after clearing cache)
    if(localStorage["showedhelp"] === undefined) {
        showHelp();
        localStorage["showedhelp"] = true;
    }

    // start rendering the canvas
    requestAnimationFrame(frame);
}

/**
 * Displays the help dialogue/tour using Intro.js
 */
function showHelp(){
    introJs().setOptions({
        steps: [{
            intro: "<b>Music Maker</b><br>by David Mahany<br><br>This site allows you to make simple pieces of music and share them by copy pasting a code (or the URL if it's short enough).<br><br>This site's functionality is entirely client side, and any stored data is in localStorage - no data is stored on the server, it just exists to serve files.<br><br>This tour will tell you how to use the UI and controls.",
            tooltipClass: 'customTooltip',
        }, {
            element: document.querySelector('#helpButton'),
            intro: "(You can click this button in the future to show this help dialogue again)"
        }, {
            element: document.querySelector('#left'),
            intro: "On the left is the list of tracks for the song.<br><br>You can <b>left click</b> them to change the active track.<br>Alternatively, you can use the up and down arrow keys to switch active tracks."
        }, {
            element: document.querySelector('#left div'),
            intro: "Right clicking a track opens a menu allowing you to change its name, instrument, and volume, or delete the track.",
            position: 'right'
        }, {
            element: document.querySelector('#left div.add'),
            intro: "You can click this button to add another track.",
            position: 'right'
        }, {
            element: document.querySelector('#right'),
            intro: "On the right is the piano roll.<br><br>You can <b>left click+drag</b> to add a note, or <b>right click, drag over notes, and release</b> to delete notes."
        }, {
            element: document.querySelector('#right'),
            intro: "Alternatively you can <b>left click</b> a note to select it (or <b>shift left click</b> to select multiple), and hit the <b>delete</b> key to delete them.<br><br>You can also <b>shift+left click and drag</b> to select notes in a box."
        }, {
            element: document.querySelector('#right'),
            intro: "If you make a mistake, you can use <b>Ctrl+Z</b> and <b>Ctrl+Y</b> to undo and redo."
        }, {
            element: document.querySelectorAll('.tp-dfwv')[2],
            intro: "You can change the note placement snapping by changing the \"snap\" option here.<br>These settings are automatically saved to localStorage."
        }, {
            element: document.querySelectorAll('.tp-dfwv')[1],
            intro: "You can change the song's tempo and length here."
        }, {
            element: document.querySelectorAll('.tp-dfwv')[0],
            intro: "You can change some rendering options here.<br>These settings are automatically saved to localStorage."
        }, {
            element: document.querySelector('#enterButton'),
            intro: "Clicking this button will open a prompt where you can paste a song code to load it."
        }, {
            element: document.querySelector('#copyButton'),
            intro: "Clicking this button will generate your song code and open a prompt where you can copy it.<br><br>You can also use <b>Ctrl+S</b> to save your song to localStorage, which persists across refreshes. This will also update the URL of the page if the code is short enough."
        }, {
            element: document.querySelector('#clearButton'),
            intro: "Clicking this button will clear your localStorage and URL.<br>If you don't copy your song's code beforehand it will be lost forever."
        }]
    }).start();
}
