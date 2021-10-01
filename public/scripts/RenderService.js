class RenderService {
    renderer = new THREE.WebGLRenderer({ alpha: true });
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    wireframe;
    mesh;
    sphereRadius;

    audio;
    audioContext;
    analyzer;
    frequencyArray;
    maxLowFrequency;
    maxHighFrequency;

    playing = false;
    songLoaded = false;
    parameters = {
        songPath: 'null',
        sphereColor: '#00ff00',
        sphereDetail: 10,
        rotationSpeed: 5,
        trebleAmplitude: 1,
        bassAmplitude: 1,
        volume: 20
    };

    simplexNoise = new SimplexNoise();

    constructor() {
        this.initRenderer();
        this.createSphere(1);
    }

    // initialize three.js renderer
    initRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
    }

    // initialize Audio with AudioContext for analyzing frequencies
    initAudioContext() {
        this.audio = new Audio();
        this.audio.volume = this.parameters.volume / 100;
        this.audioContext = new AudioContext();
        const audioSource = this.audioContext.createMediaElementSource(this.audio);

        this.analyzer =  this.audioContext.createAnalyser();
        audioSource.connect(this.analyzer);
        this.analyzer.connect( this.audioContext.destination);
        this.analyzer.fftSize = 512;
        this.frequencyArray = new Uint8Array(this.analyzer.frequencyBinCount);
        this.maxLowFrequency = 1;
        this.maxHighFrequency = 1;
    }

    // toggle whether song is playing
    togglePlaying() {
        if (this.songLoaded) {
            this.playing = !this.playing;
            if (this.playing) {
                this.audio.play();
                this.render();
            }
        }
    }

    // change rendering parameter
    changeParameter(name, value) {
        this.parameters[name] = value;
        if (name.includes('sphere')) {
            this.createSphere();
        }
    }

    // update song and autoplay
    changeSong(songPath) {
        if (this.songLoaded && this.playing) {
            this.togglePlaying();
        }

        if (songPath !== 'null') {
            if (!this.audioContext) {
                this.initAudioContext();
            }

            this.audio.src = this.parameters.songPath = songPath;
            this.audio.load();
            this.songLoaded = true;

            this.togglePlaying();
        }
    }

    // change audio volume
    changeVolume(volume) {
        this.parameters.volume = volume;
        if (this.audio) {
            this.audio.volume = volume / 100;
        }
    }

    // create new sphere based on specified parameters
    createSphere(radius = this.sphereRadius) {
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

    // render scene
    render() {
        this.analyzer.getByteFrequencyData(this.frequencyArray);

        // divide high and low frequencies
        const lowFrequencies = this.frequencyArray.slice(0, (this.frequencyArray.length / 2) - 1);
        const highFrequencies = this.frequencyArray.slice((this.frequencyArray.length / 2) - 1, this.frequencyArray.length - 1);

        // calculate average frequencies
        const lowFrequencyAverage = this.sum(lowFrequencies) / lowFrequencies.length;
        const highFrequencyAverage = this.sum(highFrequencies) / highFrequencies.length;

        // calculate new max frequencies
        this.maxLowFrequency = lowFrequencyAverage > this.maxLowFrequency ?  lowFrequencyAverage : this.maxLowFrequency;
        this.maxHighFrequency = highFrequencyAverage > this.maxHighFrequency ?  highFrequencyAverage : this.maxHighFrequency;

        // normalize average frequencies
        const normalizedLFA = this.normalizeFrequency(lowFrequencyAverage, this.maxLowFrequency * 2);
        const normalizeHFA = this.normalizeFrequency(highFrequencyAverage,  this.maxHighFrequency * 2);

        // render sphere
        this.rotateSphere(0.00004, 0.0002)
        this.modulateSphere(normalizedLFA, normalizeHFA);
        this.renderer.render(this.scene, this.camera);

        if (this.playing) {
            requestAnimationFrame(() => this.render());
        } else {
            this.audio.pause();
            this.modulateSphere(0, 0);
            this.renderer.render(this.scene, this.camera);
        }
    }

    // animates sphere vertices to visualize frequencies
    modulateSphere(bass, treble) {
        this._modulateSphere(this.wireframe, this.sphereRadius, bass, treble);
        this._modulateSphere(this.mesh, this.sphereRadius - 0.01, bass, treble);
    }

    _modulateSphere(object, radius, bass, treble) {
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

    // rotate sphere
    rotateSphere(x, y) {
        this.wireframe.rotation.x += x * this.parameters.rotationSpeed;
        this.wireframe.rotation.y += y * this.parameters.rotationSpeed;
        this.mesh.rotation.x += x * this.parameters.rotationSpeed;
        this.mesh.rotation.y += y * this.parameters.rotationSpeed;
    }

    // normalize frequency to a range of 0 to 1
    normalizeFrequency(fr, max) {
        return Math.min(fr / max, 1);
    }

    // calculate vector magnitude for a vertex array
    getMagnitude(vertex) {
        return Math.sqrt(vertex.reduce((a, b) => a + b * b, 0));
    }

    // sum array of numbers
    sum(array) {
        return array.reduce((a, b) => a + b);
    }
}
