function VisualizeSong() {
    let canvas = document.getElementById('canvas')
    if (canvas != null) {
        let ctx = canvas.getContext('2d')
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024
        mediaPlayer.connect(analyser)
        let results = new Uint8Array( analyser.frequencyBinCount )
        function draw() {
            window.requestAnimationFrame( draw )
            ctx.fillStyle = backColor
            ctx.fillRect( 0,0,canvas.width,canvas.height )
            ctx.fillStyle = freqColor
            analyser.getByteFrequencyData( results )
            for( let i = 0; i < results.length; i++ ) {
                ctx.fillRect(i*(canvas.width/results.length), canvas.height, Math.ceil((canvas.width/results.length)), -results[i]*freqMult)
            }
          }
          draw()

    }
}