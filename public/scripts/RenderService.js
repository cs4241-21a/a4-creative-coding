class RenderService {
    renderer = new THREE.WebGLRenderer({ alpha: true });
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    wireframe;
    mesh;
    sphereRadius;

    audio;
    analyzer;
    frequencyArray;

    playing = false;
    songLoaded = false;
    parameters = {
        song: 'TheySaid',
        sphereColor: '#00ff00',
        sphereDetail: 10,
        rotationSpeed: 5,
        trebleAmplitude: 1,
        bassAmplitude: 1
    };

    simplexNoise = new SimplexNoise();

    constructor() {
        this.initializeRenderer();
        this.updateSphere(1);
    }

    updateParameter(name, value) {
        this.parameters[name] = value;
        if (name.includes('sphere')) {
            this.updateSphere();
        }
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

    updateSphere(radius = this.sphereRadius) {
        if (this.wireframe || this.mesh) {
            this.scene.remove(this.wireframe);
            this.scene.remove(this.mesh);
        }
        this.sphereRadius = radius;

        let geometry = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(radius, this.parameters.sphereDetail));
        let material = new THREE.LineBasicMaterial({ color: this.parameters.sphereColor });
        this.wireframe = new THREE.LineSegments(geometry, material);
        this.scene.add(this.wireframe);

        geometry = new THREE.IcosahedronGeometry(this.sphereRadius, this.parameters.sphereDetail);
        material = new THREE.MeshBasicMaterial({ color: "#000", opacity: 0.75 });
        material.transparent = true;
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    render() {
        this.analyzer.getByteFrequencyData(this.frequencyArray);

        // divide high and low frequencies
        const lowFrequencies = this.frequencyArray.slice(0, (this.frequencyArray.length / 2) - 1);
        const highFrequencies = this.frequencyArray.slice((this.frequencyArray.length / 2) - 1, this.frequencyArray.length - 1);

        // calculate average frequencies
        const lowFrequencyAverage = this.sum(lowFrequencies) / lowFrequencies.length;
        const highFrequencyAverage = this.sum(highFrequencies) / highFrequencies.length;

        this.rotateSphere(0.00004, 0.0002)
        this.modulateSphere(this.wireframe, this.sphereRadius, this.normalizeFrequency(lowFrequencyAverage), this.normalizeFrequency(highFrequencyAverage));
        this.modulateSphere(this.mesh, this.sphereRadius - 0.01, this.normalizeFrequency(lowFrequencyAverage), this.normalizeFrequency(highFrequencyAverage));
        this.renderer.render(this.scene, this.camera);

        if (this.playing) {
            requestAnimationFrame(() => this.render());
        } else {
            this.audio.pause();
        }
    }

    // animates sphere vertices to visualize frequencies
    modulateSphere(object, radius, bass, treble) {
        const vertices = object.geometry.attributes.position.array;
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

            // scale vertex by calculated distance based on sphere radius, bass, noise, and treble
            const distance = radius + (bass * this.parameters.bassAmplitude) + (noise * treble * this.parameters.trebleAmplitude);
            for (let j = i; j < i + 3; j++) {
                vertices[j] = vertices[j] * distance;
            }
        }
        object.geometry.attributes.position.needsUpdate = true;
    }

    rotateSphere(x, y) {
        this.wireframe.rotation.x += x * this.parameters.rotationSpeed;
        this.wireframe.rotation.y += y * this.parameters.rotationSpeed;
        this.mesh.rotation.x += x * this.parameters.rotationSpeed;
        this.mesh.rotation.y += y * this.parameters.rotationSpeed;
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
