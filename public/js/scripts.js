import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Clock } from 'https://unpkg.com/three/build/three.module.js';
import * as BOIDS from './boids.js';

window.onload = onWindowLoad;
let clock, scene, camera, renderer;

function onWindowLoad() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 20;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    BOIDS.boidsSetup(scene);

    clock = new THREE.Clock();
    clock.start();
    update();
    //renderer.setAnimationLoop(update);
}

function update() {
    const deltaTime = clock.getDelta();
    BOIDS.simulateBoids(deltaTime);
    console.log(`Delta time: ${deltaTime}`);
    renderer.render( scene, camera )
    window.requestAnimationFrame( update );
}