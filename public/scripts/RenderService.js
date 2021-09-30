class RenderService {
    renderer = new THREE.WebGLRenderer({ alpha: true });
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    sphere;
    sphereRadius;

    audio;
    analyzer;
    frequencyArray;

    playing = false;
    songLoaded = false;
    parameters = {
        song: 'TheySaid'
    };

    simplexNoise = new SimplexNoise();

    constructor() {
        this.initializeRenderer();
        this.updateSphere(1);
    }

    updateParameter(name, value) {
        this.parameters[name] = value;
    }

    togglePlaying() {
        this.playing = !this.playing;
        if (this.playing) {
            if (!this.songLoaded) {
                this.updateSong(`/songs/${ this.parameters.song }.mp3`);
            }
            this.audio.play();
            this.render();
        }
    }

    initializeRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
    }

    updateSong(songName) {
        this.audio = document.getElementById('audio');
        this.audio.src = songName;
        this.audio.load();
        this.songLoaded = true;
        this.audio.volume = 0.2;

        const audioContext = new AudioContext();
        const src = audioContext.createMediaElementSource(this.audio);
        this.analyzer = audioContext.createAnalyser();
        src.connect(this.analyzer);
        this.analyzer.connect(audioContext.destination);
        this.analyzer.fftSize = 512;
        this.frequencyArray = new Uint8Array(this.analyzer.frequencyBinCount);
    }

    updateSphere(sphereRadius) {
        this.sphereRadius = sphereRadius;
        const geometry = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(sphereRadius, 10));
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00});
        this.sphere = new THREE.LineSegments(geometry, material);
        this.scene.add(this.sphere);
    }

    render() {
        this.analyzer.getByteFrequencyData(this.frequencyArray);

        // divide high and low frequencies
        const lowFrequencies = this.frequencyArray.slice(0, (this.frequencyArray.length / 2) - 1);
        const highFrequencies = this.frequencyArray.slice((this.frequencyArray.length / 2) - 1, this.frequencyArray.length - 1);

        // calculate average frequencies
        const lowFrequencyAverage = this.sum(lowFrequencies) / lowFrequencies.length;
        const highFrequencyAverage = this.sum(highFrequencies) / highFrequencies.length;

        this.sphere.rotation.y += 0.001;
        this.sphere.rotation.x += 0.00025;
        this.visualizeFrequencies(this.normalizeFrequency(lowFrequencyAverage), this.normalizeFrequency(highFrequencyAverage));
        this.renderer.render(this.scene, this.camera);

        if (this.playing) {
            requestAnimationFrame(() => this.render());
        } else {
            this.audio.pause();
        }
    }

    // animates sphere vertices to visualize frequencies
    visualizeFrequencies(bass, treble) {
        const vertices = this.sphere.geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            // normalize vertex to default sphere shape
            const magnitude = this.getMagnitude([vertices[i], vertices[i + 1], vertices[i + 2]]);
            for (let j = i; j < i + 3; j++) {
                if (vertices[j] !== 0) {
                    vertices[j] = vertices[j] / magnitude;
                }
            }

            // generate simplex noise for vertex
            const noise = this.simplexNoise.noise3D(
                vertices[i],
                vertices[i + 1],
                vertices[i + 2]
            );

            // scale vertex by calculated distance based on bass, sphere radius, noise, and treble
            const distance = bass + this.sphereRadius + (noise * treble);
            for (let j = i; j < i + 3; j++) {
                vertices[j] = vertices[j] * distance;
            }
        }
        this.sphere.geometry.attributes.position.needsUpdate = true;
    }

    // normalizes frequency to a range of 0 to 1
    normalizeFrequency(fr) {
        return Math.min(fr / 100, 1);
    }

    // calculates vector magnitude for a vertex array
    getMagnitude(vertex) {
        return Math.sqrt(vertex.reduce((a, b) => a + b * b, 0));
    }

    // sums array of numbers
    sum(array) {
        return array.reduce((a, b) => a + b);
    }
}
