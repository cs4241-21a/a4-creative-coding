import {frequencyData, getFrequencyData} from "./media/audio.js";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pulseFactor = 0.5;
const canvasCtx = canvas.getContext("2d");
let colors = {
    1: [0, 0, 0],
    2: [0, 0, 0],
    3: [0, 0, 0]
};

export function setColor(id, color) {
    colors[id] = color;
}

export function setPulse(value) {
    pulseFactor = value;
}

export function Background() {
    let background = {
        draw() {
            requestAnimationFrame(this.draw.bind(this));
            canvasCtx.fillStyle = "#000";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };
    background.draw()
}

export function Bar(range, color) {
    let bar = {
        draw() {
            requestAnimationFrame(this.draw.bind(this));
            getFrequencyData();
            let barWidth = (canvas.width / (range.high - range.low));

            let x = 0;

            for (let i = range.low; i < range.high; i++) {
                let amplitude = frequencyData[i];
                let percent = amplitude / 255;
                let r = percent * colors[color][0];
                let g = percent * colors[color][1];
                let b = 50;

                canvasCtx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                canvasCtx.fillRect(x, canvas.height - amplitude, barWidth, amplitude);
                x += barWidth + 1;
            }
        }
    };
    bar.draw();
}


function Circle(range, baseRadius, coords, color) {
    let circle = {
        rads: Math.PI * 2 / range.size,
        circumference: 0,
        radius: 0,
        draw() {
            requestAnimationFrame(this.draw.bind(this));
            getFrequencyData();
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgb(146,180,214)";
            canvasCtx.beginPath();
            let ampSum = 0;
            for (let i = range.low; i < range.high; i++) ampSum += frequencyData[i];
            let radiusPercent = ampSum / range.size / 255;
            this.radius = (baseRadius * (1 - pulseFactor)) + (baseRadius * pulseFactor) * radiusPercent;
            this.circumference = Math.PI * 2 * this.radius;
            // console.log("Radius: " + this.radius);
            canvasCtx.arc(coords.x, coords.y, this.radius, 0, 2 * Math.PI);
            canvasCtx.stroke();
            for (let i = range.low; i < range.high; i++) this.drawRay(i)
        },
        drawRay: function (i) {
            let volume = frequencyData[i];
            let bar_height = frequencyData[i] * .8;
            const cos = Math.cos(this.rads * i);
            const sin = Math.sin(this.rads * i);
            let bar_x = coords.x + cos * this.radius;
            let bar_y = coords.y + sin * this.radius;
            let bar_x2 = coords.x + cos * (this.radius + bar_height);
            let bar_y2 = coords.y + sin * (this.radius + bar_height);
            let percent = volume / 255;
            canvasCtx.strokeStyle = "rgb(" + percent * colors[color][0] + ", " + percent * colors[color][1] + ", " + colors[color][2] + ")";
            canvasCtx.lineWidth = this.circumference / range.size;
            canvasCtx.beginPath();
            canvasCtx.moveTo(bar_x, bar_y);
            canvasCtx.lineTo(bar_x2, bar_y2);
            canvasCtx.stroke();
        }
    };
    circle.draw();
}

function Coords(x_part, y_part) {
    this.x = canvas.width * x_part;
    this.y = canvas.height * y_part;
}

export function circleRow(count, radius, height, frequencyRange, color) {
    let spacing = (canvas.width - (count * radius * 2)) / (count + 1);
    for (let i = 1; i <= count; i++) {
        let x = ((i * spacing) + ((i - 1) * radius * 2 + radius)) / canvas.width;
        let coords = new Coords(x, height);
        Circle(frequencyRange, radius, coords, color);
    }
}

