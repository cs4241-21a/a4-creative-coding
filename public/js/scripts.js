import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as BOIDS from './boids.js';

window.onload = onWindowLoad;
let clock, scene, camera, renderer;

function onWindowLoad() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 20;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize );
    
    const sphereGeom = new THREE.SphereGeometry( 4 );
    const sphereMat = new THREE.MeshLambertMaterial( {color: 0x4f72ba} );
    const sphere = new THREE.Mesh( sphereGeom, sphereMat );
    scene.add(sphere);

    const ambient = new THREE.AmbientLight( 0xffffff, 0.4);
	scene.add( ambient );

    const directional = new THREE.DirectionalLight( 0xffffff, 1);
    directional.position.set(10, 20, 20);
    directional.castShadow = true;
	scene.add( directional );

    BOIDS.boidsSetup(scene);

    clock = new THREE.Clock();
    clock.start();
    update();


    // Set up Tweakpane
    const pane = new Tweakpane.Pane({ title: 'Boid Controls', });

    const DEFAULT = {
        'Boid Count': 50,
        'Flocking Distance': 3,
        'Aligning Distance': 2,
        'Avoiding Distance': 3
    };

    // Copy default params, so PARAMS can change independently
    const PARAMS = JSON.parse(JSON.stringify(DEFAULT));
    
    pane.addInput( PARAMS, 'Boid Count', {min: 5, max: 200, step: 5} )
        .on('change', (ev) => { BOIDS.changeBoidCount(ev.value); });
    pane.addInput( PARAMS, 'Flocking Distance', {min: 1, max: 15, step: 1} )
        .on('change', (ev) => { BOIDS.changeFlockingDistance(ev.value); });
    pane.addInput( PARAMS, 'Aligning Distance', {min: 0.5, max: 10, step: 0.1} )
        .on('change', (ev) => { BOIDS.changeAligningDistance(ev.value); });
    pane.addInput( PARAMS, 'Avoiding Distance', {min: 0.5, max: 5, step: 0.1} )
        .on('change', (ev) => { BOIDS.changeAvoidingDistance(ev.value); });
    pane.addSeparator();
    pane.addButton({ title: 'Reset', })
        .on('click', () => { pane.importPreset(DEFAULT); });    
}

function onWindowResize() {
    // Borrowed from THREE.js examples
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function update() {
    const deltaTime = clock.getDelta();
    BOIDS.simulateBoids(deltaTime);
    renderer.render( scene, camera )
    window.requestAnimationFrame( update );
}