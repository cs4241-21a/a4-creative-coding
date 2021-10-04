// import our three.js reference
import * as THREE from "https://unpkg.com/three/build/three.module.js";



const app = {
  init() {
    app.scene = new THREE.Scene();
    const listener = new THREE.AudioListener();
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
   // app.playButton = 


    app.camera = new THREE.PerspectiveCamera();
    app.camera.position.z = 50;
    app.camera.add(listener);

    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.renderer.domElement);

   // app.createLights();
   const pointLight = new THREE.PointLight(0xffffff);
   pointLight.position.z = 100;
   app.scene.add(pointLight); 
   
   app.knot = app.createKnot();
   

    // ...the rare and elusive hard binding appears! but why?
    app.render = app.render.bind(app);

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
    app.analyser = audioCtx.createAnalyser();
    app.analyser.fftSize = 1024; // 512 bins
    const player = audioCtx.createMediaElementSource(audioElement);
    player.connect(audioCtx.destination);
    player.connect(app.analyser);

    // make sure, for this example, that your audiofle is accesssible
    // from your server's root directory... here we assume the file is
    // in the ssame location as our index.html file
    audioElement.src = 'observer.mp3'
    audioElement.play();

    app.results = new Uint8Array(app.analyser.frequencyBinCount);

        
    const pane = new Tweakpane.Pane();

    const objcolor = 0x0088ff;

    const PARAMS = {
      song: "Observer by Avalon",
      dodecahedron_color: 0x0088ff,
      volume: 0.5,

    };

    

   // const changeColor = (color) => app.changeObjectColor( color);

    pane.addInput(PARAMS, 'song')


    pane.addInput(PARAMS, 'dodecahedron_color', {
      view: 'color',
    });

    pane.addInput(PARAMS, 'volume', {
      min: 0,
      max: 1,
    });

     
    app.render();
  },

  // createLights() {
  //   const pointLight = new THREE.PointLight(0xffffff);
  //   pointLight.position.z = 100;
  //   app.scene.add(pointLight);
  // },


  createKnot() {
    const knotgeo = new THREE.DodecahedronGeometry(10,0);
    const mat = new THREE.MeshPhongMaterial({
      color: 0x0088ff,
      shininess: 2000
    });
    const knot = new THREE.Mesh(knotgeo, mat);
    knot.wireframe = true;

    app.scene.add(knot);
    return knot;
  },

  render() {
    app.analyser.getByteFrequencyData(app.results);

    //have the knot rotate in accordance with the sound frequency
    for (let i = 0; i < app.analyser.frequencyBinCount; i++) {
      app.knot.rotation.x += app.results[i];
      app.knot.rotation.y += app.results[i];
      app.knot.shininess += app.results[i];
      app.knot.rotation.z += app.results[i];

    }
    app.renderer.render(app.scene, app.camera);
    window.requestAnimationFrame(app.render);
  }
};

//window.onload = () => app.init();

const playButton = document.getElementById( 'playButton' );
playButton.addEventListener( 'click', app.init );

