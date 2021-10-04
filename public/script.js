import * as three from "./three/build/three.module.js";


//turn overlay on and off
const overlay = document.getElementById("overlay");
function overlayOn(){
    overlay.style.display = "block";
}

function overlayOff(){
    overlay.style.display = "none";
}

const offBtn = document.getElementById("overlay-off-btn");
offBtn.addEventListener("click", overlayOff);


//create tweakpane
var rng = null;
const params = {seed: "seed", loCount: 50, hiCount: 150, color: true, rotate: true, scale: true};
{
    const pane = new Tweakpane.Pane();

    pane.addInput(params, "seed");
    const col = pane.addInput(params, "color");
    const rot = pane.addInput(params, "rotate");
    const scl = pane.addInput(params, "scale");

    const limits = pane.addFolder({title: "Cube count", expanded: true});
    limits.addInput(params, "loCount", {min:1, step:1});
    limits.addInput(params, "hiCount", {min:1, step:1});

    const generateBtn = pane.addButton({title: "Generate"});
    pane.addSeparator();
    const onBtn = pane.addButton({title: "See Instructions"});
    
    col.on("change", generateScene);
    rot.on("change", generateScene);
    scl.on("change", generateScene);
    generateBtn.on("click", generateScene);
    onBtn.on("click", overlayOn);
}


//create three.js scene and camera
const canvas = document.querySelector("#c");
const renderer = new three.WebGLRenderer({canvas});

const fov = 75;
const aspect = 2;
const near = .1;
const far = 2000;
const camera = new three.PerspectiveCamera(fov, aspect, near, far);

const scene = new three.Scene();


//called on page start
let cubes = [];
function generateScene(){
    cubes.forEach((ele) => {
        ele.cube.material.dispose();
    })
    scene.clear();
    cubes = [];
    rng = new Math.seedrandom(params.seed);

    const numCubes = Math.abs(rng.int32() % (params.hiCount - params.loCount + 1)) + params.loCount;
    const geometry = new three.BoxGeometry(1, 1, 1);
    
    for(let i = 0; i < numCubes; i++){
        let color = (rng.int32() % (0xffffff + 1));
        if(!params.color) color = 0xaaaaaa;

        let rotRate = rng() + .5;
        if(!params.rotate) rotRate = 0;

        const x = (rng() * 10) - 5;
        const y = (rng() * 10) - 5;
        const z = (rng() * 10) - 5;
        let cube = makeInstance(scene, geometry, color, x, y, z);
        
        cube.scale.set(rng()+.5, rng()+.5, rng()+.5);
        let xScaleRate = rng()+.5;
        let yScaleRate = rng()+.5;
        let zScaleRate = rng()+.5;
        let xScaleStart = rng() * 2 * Math.PI;
        let yScaleStart = rng() * 2 * Math.PI;
        let zScaleStart = rng() * 2 * Math.PI;

        cubes.push({cube, rotRate,
            initScale: cube.scale.clone(),
            xScaleRate, yScaleRate, zScaleRate,
            xScaleStart, yScaleStart, zScaleStart});
    }

    addLight(scene, {x:7, y:7, z:7});
    addLight(scene, {x:-7, y:7, z:-7});
    addLight(scene, {x:7, y:7, z:-7}, {x:0, y:0, z:0}, 0.2);
    addLight(scene, {x:-7, y:7, z:7}, {x:0, y:0, z:0}, 0.2);
    addLight(scene, {x:0, y:-8, z:0}, {x:0, y:0, z:0}, 0.2);
}

//render loop
{
    function render(time){
        time *= .001; //time is in seconds

        //keep renderer and camera sized correctly
        if(resizeRenderer(renderer)){
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach((ele, i) => {
            //rotate cubes
            const rot = time * ele.rotRate;
            ele.cube.rotation.x = rot;
            ele.cube.rotation.y = rot;
            
            //scale cubes
            if(params.scale){
                const xScaleChange = Math.sin(ele.xScaleRate*time + ele.xScaleStart);
                const yScaleChange = Math.sin(ele.yScaleRate*time + ele.yScaleStart);
                const zScaleChange = Math.sin(ele.zScaleRate*time + ele.zScaleStart);
                ele.cube.scale.set(ele.initScale.x+xScaleChange, ele.initScale.y+yScaleChange, ele.initScale.z+zScaleChange);
            }
        })

        const t = time/7;
        camera.position.x = 10*Math.cos(t);
        camera.position.z = -10*Math.sin(t);
        camera.rotation.y = t+(Math.PI/2);

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


//helpers
function makeInstance(scene, geometry, color, x, y, z){
    const material = new three.MeshPhongMaterial({color});

    const mesh = new three.Mesh(geometry, material);
    scene.add(mesh);

    mesh.position.set(x, y, z);

    return mesh;
}

function resizeRenderer(renderer){
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if(needResize){
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function addLight(scene, pos, target, intensity){
    if(target === undefined){
        target = {x: 0, y: 0, z: 0}
    }
    if(intensity === undefined){
        intensity = 1;
    }

    const light = new three.DirectionalLight(0xffffff, intensity);
    light.position.set(pos.x, pos.y, pos.z);
    scene.add(light.target)
    light.target.position.set(target.x, target.y, target.z);
    scene.add(light);
}

generateScene();