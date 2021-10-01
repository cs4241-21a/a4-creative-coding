// import our three.js reference
import * as THREE from "https://unpkg.com/three/build/three.module.js";

const app = {
  init() {
    this.scene = new THREE.Scene();
    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    this.camera = new THREE.PerspectiveCamera();
    this.camera.position.z = 50;
    this.camera.add(listener);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    this.createLights();
    this.knot = this.createKnot();

    // ...the rare and elusive hard binding appears! but why?
    this.render = this.render.bind(this);

    /*
	  audioLoader.load( 'https://cdn.glitch.com/ae86c621-1098-461e-a007-91cc0028fe6c%2Fobserver.mp3?v=1633067714870', function( buffer ) {
	  sound.setBuffer( buffer );
	  sound.setLoop( true );
	  sound.setVolume( 0.5 );
	  sound.play();
	  })
    */

    // audio init
    const audioCtx = new AudioContext();
    const audioElement = document.createElement("audio");
    document.body.appendChild(audioElement);

    // audio graph setup...using audioElement to load the music instead of sound...does that matter?
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024; // 512 bins
    const player = audioCtx.createMediaElementSource(audioElement);
    player.connect(audioCtx.destination);
    player.connect(analyser);

    // make sure, for this example, that your audiofle is accesssible
    // from your server's root directory... here we assume the file is
    // in the ssame location as our index.html file
    audioElement.src =
      "https://cdn.glitch.com/ae86c621-1098-461e-a007-91cc0028fe6c%2Fobserver.mp3?v=1633067714870";
    audioElement.play();

    const results = new Uint8Array(analyser.frequencyBinCount);

    this.render();
  },

  createLights() {
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.z = 100;
    this.scene.add(pointLight);
  },

  createKnot() {
    const knotgeo = new THREE.TorusKnotGeometry(10, 0.1, 128, 16, 5, 21);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 2000
    });
    const knot = new THREE.Mesh(knotgeo, mat);

    this.scene.add(knot);
    return knot;
  },

  render() {
    this.analyser.getByteFrequencyData(this.results);

    //have the knot rotate in accordance with the sound frequency
    for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
      this.knot.rotation.x += this.results[i];
    }
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render);
  }
};

window.onload = () => app.init();
