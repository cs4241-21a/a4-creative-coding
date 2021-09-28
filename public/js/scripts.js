class Controls {
    constructor(opts = {handler: {}, container: undefined}) {
        this.Volume = 1
        this.FPS = 60
        this.Speed = 1.0
        this.Peak_Algorithm = "average"
        this.FFT_Smoothness = 0.7
        this.Peak_Granularity = 2
        this.FFT_Columns = 32
        this.Primary_Color = "#4a45a0"
        this.Secondary_Color = "#8e78f3"
        this.Background_Color = "#370050"

        this._handler = opts.handler || {};
        const params = {
            percentage: 20,
            theme: 'dark'
        };
        const pane = new Tweakpane.Pane({title: "Controls", container: opts.container})
        this._pane = pane
        const callHandler = name => {
            if (name in this._handler) {
                //console.log(name+" found in handler")
                this._handler[name](this[name])
            }
        }
        const volParams = {
            Volume: 100
        }
        pane.addInput(volParams, 'Volume', {
            step: 1,
            min: 0,
            max: 100,
        }).on("change", (event) => {
            this.Volume=event.value/100
            callHandler('Volume')
        })
        const speedParams = {
            Speed: 1,
        }
        pane.addInput(speedParams, 'Speed', {
            default: 1,
            min: 0.5,
            max: 2,
            step: 0.25,
        }).on("change", (event) => {
            this.Speed = event.value
            callHandler('Speed')
        })
        const fpsParams = {
            FPS: 60,
        }
        pane.addInput(fpsParams, 'FPS', {
            step: 1,
            min: 1,
            max: 144,
        }).on("change", (event) => {
            console.log("FPS = "+event.value)
            this.FPS = event.value
            callHandler('FPS')
        })
        pane.addSeparator()
        const peakAlgorithmParams = {
            Peak_Algorithm: "average",
        }
        pane.addInput(peakAlgorithmParams, "Peak_Algorithm", {
            options: {
                Average: "average",
                Maximum: "maximum",
            },
        }).on("change", (event) => {
            this.Peak_Algorithm = event.value
            callHandler('Peak_Algorithm')
        })
        const peakGranParams = {
            Peak_Granularity: 2
        }
        pane.addInput(peakGranParams, 'Peak_Granularity', {
            step: 1,
            min: 1,
            max: 15,
        }).on("change", (event) => {
            this.Peak_Granularity = event.value
            callHandler('Peak_Granularity')
        })
        pane.addSeparator()
        const fftColumnsParams = {
            FFT_Columns: 32,
        }
        pane.addInput(fftColumnsParams, 'FFT_Columns', {
            options: {
                16: 16,
                32: 32,
                64: 64,
                128: 128,
                256: 256,
                512: 512,
                1024: 1024
            }
        }).on("change", (event) => {
            this.FFT_Columns = event.value
            callHandler('FFT_Columns')
        })
        const fftSmoothnessParams = {
            FFT_Smoothness: 70,
        }
        pane.addInput(fftSmoothnessParams, "FFT_Smoothness", {
            step: 1,
            min: 1,
            max: 100,
        }).on("change", (event) => {
            this.FFT_Smoothness = event.value/100
            callHandler('FFT_Smoothness')
        })
        pane.addSeparator()
        const colorParams = {
            Primary_Color: "#4a45a0",
            Secondary_Color: "#8e78f3",
            Background_Color: "#370050"
        }
        pane.addInput(colorParams, 'Primary_Color').on("change", (event) => {
            this.Primary_Color = event.value
            callHandler('Primary_Color')
        })
        pane.addInput(colorParams, 'Secondary_Color').on("change", (event) => {
            this.Secondary_Color = event.value
            callHandler('Secondary_Color')
        })
        pane.addInput(colorParams, 'Background_Color').on("change", (event) => {
            this.Background_Color = event.value
            callHandler("Background_Color")
        })

    }
}

class InfoText {
    constructor() {
        this.resetText()
    }

    resetText() {
        this.type = ''
        this.text = ''
        this.color = ''
    }

    normalText(text) {
        this.type = 'STATUS'
        this.text = text
        this.color = '#ffffff'
    }

    errorText(text) {
        this.type = 'ERROR'
        this.text = text
        this.color = '#ff0000'
    }
}

const p5Context = {
    /** @type InfoText */
    infoText: new InfoText(),
    /** @type Controls */
    controls: null,
    /** @type p5.SoundFile */
    sound: null,
    rate: null,
    rawPeaks: null,
    peaks: null,
    /** @type p5.FFT */
    fftVals: null,
    spectrum: null
};

function normalizePeakAlgorithm(rawPeaks, gran, normalizerVal = "average") {
    let normPeaks = rawPeaks;
    const normalizers = {
        average: vals => vals.reduce((a, b) => a + b, 0) / vals.length,
        maximum: vals => Math.max(...vals),
    };
    const normalizeAlgorithm = normalizers[normalizerVal];
    let finalPeaks = new Float32Array(Math.ceil(normPeaks.length / gran));
    {
        let i;
        let valArray = [];
        for (i = 0; i < normPeaks.length; i++) {
            valArray.push(normPeaks[i]);
            if ((i + 1) % gran === 0) {
                finalPeaks[Math.ceil(i / gran)] = normalizeAlgorithm(valArray);
                valArray = [];
            }
        }
        const n = (i + 1) % gran;
        if (n !== 0) {
            finalPeaks[Math.ceil(i / gran)] = normalizeAlgorithm(valArray);
        }
    }
    normPeaks = finalPeaks;
    finalPeaks = null;
    {
        const maxVal = normPeaks.reduce((prev, v) => prev < v ? v : prev);
        finalPeaks = normPeaks.map(v => v / maxVal);
    }
    return finalPeaks;
}

function updatePeaks() {
    //If no peaks, return
    if (!p5Context.rawPeaks)
        return
    p5Context.peaks = normalizePeakAlgorithm(p5Context.rawPeaks, Math.floor(p5Context.rawPeaks.length * p5Context.controls.Peak_Granularity / width), p5Context.controls.Peak_Algorithm)
}

function updateSpectrum() {
    //If no fft values, return
    if (!p5Context.fftVals)
        return
    const bins = p5Context.controls.FFT_Columns
    let fft = new p5.FFT()
    fft = p5Context.fftVals
    p5Context.spectrum = fft.analyze(bins)
}

//p5 function setup
function setup() {
    //Make new controls
    p5Context.controls = new Controls({
        handler: {
            Volume: () => {p5Context.sound && p5Context.sound.setVolume(p5Context.controls.Volume);},
            Speed: () => {p5Context.sound && p5Context.sound.rate(p5Context.controls.Speed);},
            FPS: () => {frameRate(p5Context.controls.FPS);},
            FFT_Smoothness: () => {p5Context.fftVals && p5Context.fftVals.smooth(p5Context.controls.FFT_Smoothness);},
            Peak_Algorithm: () => {updatePeaks();},
            Peak_Granularity: () => {updatePeaks();},
            Primary_Color: () => {},
            Secondary_Color: () => {},
            Background_Color: () => {displayBackground(p5Context.controls.Background_Color);}
        }
    })
    soundFormats('mp3', 'wav', 'ogg', 'm4a', 'aac')
    frameRate(p5Context.controls.FPS)
    const p5Canvas = createCanvas(windowWidth, windowHeight)
    p5Canvas.mouseClicked(() => {//Pause/play sound if sound file is loaded.
        if (p5Context.sound) {
            if (p5Context.sound.isPlaying()) {
                const posY = mouseY / height
                if (posY < 0.4 || (1 - 0.4) < posY)
                    p5Context.sound.pause()
                else {
                    const posX = mouseX / width
                    p5Context.sound.jump(p5Context.sound.duration() * posX)
                }
            } else
                p5Context.sound.play();
        }
    });
    p5Canvas.drop(file => {
        if (file.type !== 'audio') {
            p5Context.infoText.errorText('ERROR: File must be of type \'mp3\', \'wav\', \'ogg\', \'m4a\', \'aac\', \'flac\'.')
            return
        }
        p5Context.infoText.normalText(`Loading ${file.name}...`)
        p5Context.sound = loadSound(file, () => {
            p5Context.infoText.resetText()
            p5Context.sound.setVolume(p5Context.controls.volume)
            p5Context.rawPeaks = p5Context.sound.getPeaks(p5Context.sound.duration * 1000)
            updatePeaks()
            p5Context.fftVals = new p5.FFT(p5Context.controls.FFT_Smoothness)
            p5Context.fftVals.setInput(p5Context.sound)
        }, error => {
            p5Context.infoText.errorText(error.message)
        })
    })
    p5Context.infoText.normalText("Drag and drop an audio file.")
}

//p5 function for handling window resize
function windowResized() {
    resizeCanvas(window.windowWidth, window.windowHeight)
}

function displayInfoText() {
    if (p5Context.infoText.type === '')
        return
    textSize(24)
    fill(p5Context.infoText.color)
    text(`${p5Context.infoText.type}: ${p5Context.infoText.text}`, 10, 10, width - 10, height - 10)
}

function displayPeaks() {
    if(!p5Context.sound || !p5Context.peaks)
        return
    const lenSound = p5Context.peaks.length
    const position = p5Context.sound.currentTime() / p5Context.sound.duration() * lenSound
    const widthVal = width / lenSound
    const peakWidth = widthVal*0.8
    const maxRectangleHeight = height * (1-0.4*2)*2/3
    const baseY = height*0.4+maxRectangleHeight
    rectMode(CORNER)
    noStroke()
    for(let j = 0; j < lenSound; j++) {
        const peak = p5Context.peaks[j]
        const heightVal = Math.max(maxRectangleHeight*peak,0.5)
        const xVal = widthVal * j
        function getDisp(x, y) {//Calculate for current position in the song.
            const disp = x-y
            return disp > 1
        }
        let colorVar = getDisp(position,j)
        let color = ''
        if(colorVar)
            color = p5Context.controls.Secondary_Color
        else
            color = p5Context.controls.Primary_Color
        color = color.substring(1)
        var aRgbHex = color.match(/.{1,2}/g);
        var aRgb = [
            parseInt(aRgbHex[0], 16),
            parseInt(aRgbHex[1], 16),
            parseInt(aRgbHex[2], 16)
        ]
        let colorArray = aRgb
        fill(colorArray)
        rect(xVal,baseY-heightVal,peakWidth,heightVal)
    }

}

function displayBackground(c) {
    background(c)
}

function displayFFT() {
    if(!p5Context.sound || !p5Context.spectrum)
        return
    //console.log("Displaying FFT's")
    const rectangleCount = p5Context.controls.FFT_Columns
    const spectrum = p5Context.spectrum
    const widthVal = width / rectangleCount
    const rectangleWidth = widthVal*0.8
    const baseY = height
    const maxRectangleHeight = height * 0.40
    rectMode(CORNER)
    noStroke()
    let color = p5Context.controls.Primary_Color
    color = color.substring(1)
    var aRgbHex = color.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ]
    let colorArray = aRgb
    fill(colorArray)
    for(let j = 0; j < rectangleCount; j++) {
        const xVal = widthVal * j
        const heightVal = maxRectangleHeight * spectrum[j] / 255
        rect(xVal, baseY - heightVal, rectangleWidth, heightVal)
    }
}

//p5 draw function
function draw() {
    displayBackground(p5Context.controls.Background_Color)
    displayInfoText()
    displayPeaks()
    updateSpectrum()
    displayFFT()
}