const Nexus = window.Nexus;
   
let oscList = [];
let biquadFilterNode;
let useBiquadFilter = false;
let biquadFilterOffFrequency = 18000;
let biquadFilterOnFrequency = 550;

let mainGainNode;
let defaultGainValue = 0.25;
let currentGainValue = defaultGainValue;

let stereoPanner;
let audioContext;
let currentWaveType;

// Start button
document.querySelector('button')?.addEventListener('click', () => {
  setupAudio();
  showElements();
})

function setupAudio() {
  audioContext = new AudioContext({
    sampleRate: 48000
  })
  
  stereoPanner = audioContext.createStereoPanner()
  stereoPanner.connect(audioContext.destination)
  
  mainGainNode = audioContext.createGain()
  mainGainNode.connect(stereoPanner)
  mainGainNode.gain.value = defaultGainValue
  
  biquadFilterNode = audioContext.createBiquadFilter()
  biquadFilterNode.connect(mainGainNode)
  biquadFilterNode.frequency.value = biquadFilterOffFrequency;
  
  spectrogram.connect(mainGainNode)
}

// Create piano element
var piano = new Nexus.Piano('#piano',{
  // 'size': [500,125],
  'size': [700,200],
  'mode': 'button',  // 'button', 'toggle', or 'impulse'
  'lowNote': 24,
  'highNote': 84
})

// Create panning slider
var pan = new Nexus.Pan('#panSlider')

// Create gain dial
var dial = new Nexus.Dial('#gainDial',{
  'size': [75,75],
  'interaction': 'radial', // "radial", "vertical", or "horizontal"
  'mode': 'relative', // "absolute" or "relative"
  'min': 0.001,
  'max': 1,
  'step': 0.01,
  'value': defaultGainValue
})

// Create wave type selector
var select = new Nexus.Select('#waveTypeSelector',{
  'size': [100,30],
  'options': ['sine','square', 'sawtooth', 'triangle']
})

//Create spectrogram
var spectrogram = new Nexus.Spectrogram('#spectrogram',{
  'size': [700,250]
})

// Create toggle for biquad filter
var toggle = new Nexus.Toggle('#toggleFilter',{
    'size': [40,20],
    'state': false
})

var filterFrequency = new Nexus.Number('#filterFrequency',{
  'size': [60,30],
  'value': biquadFilterOnFrequency,
  'min': 0,
  'max': 20000,
  'step': 1
})

//
piano.on('change',function(v) {
  if (v.state) {
    let frequency = convertMidiToFrequency(v.note)
    console.log("Playing note at: " + frequency + "Hz");
    
    oscList[v.note] = playTone(frequency)
    mainGainNode.gain.setValueAtTime(mainGainNode.gain.value, audioContext.currentTime); 
    mainGainNode.gain.exponentialRampToValueAtTime(currentGainValue, audioContext.currentTime + 0.05)
  }
  else {
    mainGainNode.gain.setValueAtTime(mainGainNode.gain.value, audioContext.currentTime); 
    mainGainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.03);
    oscList[v.note].stop(audioContext.currentTime + 0.05)
  }
})

pan.on('change',function(v) {
  stereoPanner.pan.setValueAtTime(v.value, audioContext.currentTime);
})

// Gain dial functionality
dial.on('change',function(v) {
  currentGainValue = v;
  mainGainNode.gain.value = v;
})

// Wave type selector functionality
select.on('change',function(v) {
  currentWaveType = v.value
})

toggle.on('change',function(v) {
  useBiquadFilter = v
})

filterFrequency.on('change',function(v) {
  biquadFilterOnFrequency = v
  console.log(v);
})

// Convert midi pitch to a frequency.
function convertMidiToFrequency(midiNumber) {
  let e = (midiNumber - 69)/12
  return (2 ** e)*440
}

function playTone(freq) {
  let osc = audioContext.createOscillator();
  osc.connect(biquadFilterNode);
  
  if (useBiquadFilter) {
    biquadFilterNode.frequency.value = biquadFilterOnFrequency;
  }
  else {
    biquadFilterNode.frequency.value = biquadFilterOffFrequency
  }
  
  console.log(mainGainNode.gain.value)

  let type = currentWaveType;

  osc.type = type;
  osc.frequency.value = freq;
  osc.start();

  return osc;
}

// Display elements on page
function showElements() {
  document.getElementById("piano").style.display = "block"
  //document.getElementById("optionsDiv").style.display = "block"
  document.getElementById("spectrogram").style.display = "block"
  document.getElementById("start").style.display = "none"
  document.getElementById("toggleFilter").style.display = "block"
  
  let optionsDiv = document.getElementById("optionsDiv")
  optionsDiv.style.display = "flex"
  optionsDiv.style["justify-content"] = "space-between"
}