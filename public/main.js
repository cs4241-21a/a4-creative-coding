import * as THREE from "https://unpkg.com/three/build/three.module.js";

let id;

const app = {
  
  init() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera();
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    this.createLights();
    this.knot = this.createKnot(1);

    // ...the rare and elusive hard binding appears! but why?
    this.render = this.render.bind(this);
    this.render();
  },

  createLights() {
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.z = 100;
    this.scene.add(pointLight);
  },

  createKnot(radius) {
    const knotgeo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshPhongMaterial({ color: 0xCD7F32, specular: 0xbcbcbc});
    const knot = new THREE.Mesh(knotgeo, mat);
    
    this.scene.add(knot);

    return knot;
  },

  render() {
    this.renderer.render(this.scene, this.camera);
    id = window.requestAnimationFrame(this.render);
    for (let i = 1; i < 10000; i++) {
      this.knot.scale.set(10, 10, 1);
      this.knot.rotation.y += Math.PI/8;
    }
   
  },

  stop() {
    cancelAnimationFrame(id);
    
      
  var flip = Math.random() *2;
  var result;
  if(flip < 0.5){
    window.alert("it was heads");
  }
  else{
    window.alert("it was tails");
  }
  
  }
};

const btn1 = document.querySelector(".btn1");

const btn2 = document.querySelector(".btn2");

btn1.addEventListener("click", function() {
  app.init();

});

btn2.addEventListener("click", function() {
  app.stop();
});
