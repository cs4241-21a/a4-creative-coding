// add three.js renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// build scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// build sphere
const sphereRadius = 1;
const geometry = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(sphereRadius, 10));
const material = new THREE.LineBasicMaterial({ color: 0x00ff00});
const sphere = new THREE.LineSegments(geometry, material);
scene.add(sphere);

const simplexNoise = new SimplexNoise();
let playing = false;

// load and play audio
const audio = document.getElementById('audio');
audio.src = '/songs/1.mp3';
audio.load();
audio.volume = 0.2;

let analyzer = null;
let frequencyArray = null;

document.onclick = () => {
    playing = !playing;
    if (playing) {
        audio.play()

        // initialize audio analyzer
        if (!analyzer) {
            const audioContext = new AudioContext();
            const src = audioContext.createMediaElementSource(audio);
            analyzer = audioContext.createAnalyser();
            src.connect(analyzer);
            analyzer.connect(audioContext.destination);

            analyzer.fftSize = 512;
            frequencyArray = new Uint8Array(analyzer.frequencyBinCount);
        }

        render();
    } else {
        audio.pause();
    }
};

// main render loop
function render() {
    analyzer.getByteFrequencyData(frequencyArray);

    // divide high and low frequencies
    const lowFrequencies = frequencyArray.slice(0, (frequencyArray.length / 2) - 1);
    const highFrequencies = frequencyArray.slice((frequencyArray.length / 2) - 1, frequencyArray.length - 1);

    // calculate average frequencies
    const lowFrequencyAverage = sum(lowFrequencies) / lowFrequencies.length;
    const highFrequencyAverage = sum(highFrequencies) / highFrequencies.length;

    sphere.rotation.y += 0.001;
    sphere.rotation.x += 0.00025;
    visualizeFrequencies(normalizeFrequency(lowFrequencyAverage), normalizeFrequency(highFrequencyAverage));
    renderer.render(scene, camera);

    if (playing) {
        requestAnimationFrame(render);
    }
}

// animates sphere vertices to visualize frequencies
function visualizeFrequencies(bass, treble) {
    const vertices = sphere.geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        // normalize vertex to default sphere shape
        const magnitude = getMagnitude([vertices[i], vertices[i + 1], vertices[i + 2]]);
        for (let j = i; j < i + 3; j++) {
            if (vertices[j] !== 0) {
                vertices[j] = vertices[j] / magnitude;
            }
        }

        // generate simplex noise for vertex
        const noise = simplexNoise.noise3D(
            vertices[i],
            vertices[i + 1],
            vertices[i + 2]
        );

        // scale vertex by calculated distance based on bass, sphere radius, noise, and treble
        const distance = bass + sphereRadius + (noise * treble);
        for (let j = i; j < i + 3; j++) {
            vertices[j] = vertices[j] * distance;
        }
    }
    sphere.geometry.attributes.position.needsUpdate = true;
}

// normalizes frequency to a range of 0 to 1
function normalizeFrequency(fr) {
    return Math.min(fr / 100, 1);
}

// calculates vector magnitude for a vertex array
function getMagnitude(vertex) {
    return Math.sqrt(vertex.reduce((a, b) => a + b * b, 0));
}

// sums array of numbers
function sum(array) {
    return array.reduce((a, b) => a + b);
}
