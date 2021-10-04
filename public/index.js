let mouseDown = 0
let drawingCanvas = document.getElementById("canvas")
let brushSlider = document.getElementById("brushSlider")
let brushSliderLabel = document.getElementById("brushSliderLabel")
let bgpicker = document.getElementById("bgpicker")
let ctx = drawingCanvas.getContext('2d')
let cursorPos = {
    x: 0,
    y: 0
};
drawingCanvas.onmousedown = function() {
    mouseDown++
}
drawingCanvas.onmouseup = function() {
    mouseDown--
}

function getMousePos(canvas, event){
    let rect = canvas.getBoundingClientRect()
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

drawingCanvas.addEventListener('mousemove', function(event) {
    cursorPos = getMousePos(drawingCanvas, event)
})

drawingCanvas.onmousemove = function(pos) {
    if(mouseDown === 1) {
        color = getColor()
        size = brushSize()
        ctx.fillStyle = "rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]/255+")";
        ctx.fillRect(cursorPos.x-(size/2), cursorPos.y-(size/2), size, size);
    } else if (mouseDown > 1) {
        mouseDown = 1
    } else if (mouseDown < 0) {
        mouseDown = 0
    }
}

function getColor() {
    let pickerValue = document.getElementById("colorpicker").value
    let color = pickerValue.substring(1)
    console.log(color)
    return hexConvert(color)
}

function hexConvert(hex) {
    let colorInt = parseInt(hex, 16)
    let red = (colorInt >> 16) & 255
    let green = (colorInt >> 8) & 255
    let blue = colorInt & 255
    let alphaValue = document.getElementById("alphapicker").value
    let alpha = 0
    if (alphaValue < 0) {
        alpha = 0
    } else if (alphaValue > 255) {
        alpha = 255
    } else {
        alpha = alphaValue
    }
    return [red, green, blue, alpha]
}

function brushSize() {
    return brushSlider.value
}

brushSlider.oninput = function() {
    brushSliderLabel.textContent = "Brush Size: " + this.value
}

bgpicker.oninput = function() {
    drawingCanvas.style.backgroundColor = bgpicker.value
}

function mouseOff() {
    mouseDown = 0
}