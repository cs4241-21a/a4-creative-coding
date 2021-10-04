import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let boids = [];
let distanceTable = [];
/*
* Distance table records distance b/w each boid, but only stores each pair once and skips self-pairs
* Gets wider at the bottom to avoid subtracting from total (personal preference)
* Example table for 5 boids:
* [
*   [1-0],
*   [2-0, 2-1],
*   [3-0, 3-1, 3-2],
*   [4-0, 4-1, 4-2, 4-3]
* ]
*/
let distanceUpdateDelay = 2;   // How many cycles to wait before updating distance table
let distanceUpdateCounter = 0; // Counts down each cycle from update delay ^

const maxBoids = 200;
let numBoidsBuffered = 50;
let numBoids = 50;
let boidCountChanged = false;

let flockSqDistance = 9;
let alignSqDistance = 4;
let avoidSqDistance = 9;

const boidGeom = new THREE.ConeGeometry( 0.2, 0.5, 6 );

function Boid(mesh) {
    this.speed = 1;
    this.mesh = mesh;
    this.getPos = (() => this.mesh.position);
    this.setPos = (pos => this.mesh.position.copy(pos));
    this.fwdDir = new THREE.Vector3(0, 1, 0);
    this.active = true;
    this.setActive = function(activate) {
        this.active = activate;
        this.mesh.material.visible = activate;
    }
}

export function changeBoidCount(count) {
    numBoidsBuffered = Math.min(count, maxBoids);
    boidCountChanged = true;
}

export function changeFlockingDistance(distance) { flockSqDistance = distance * distance; }
export function changeAligningDistance(distance) { alignSqDistance = distance * distance; }
export function changeAvoidingDistance(distance) { avoidSqDistance = distance * distance; }

export function boidsSetup(scene) {
    boidGeom.rotateX( Math.PI / 2 );
    for (let i = 0; i < maxBoids; i++) {
        const boidMat = new THREE.MeshLambertMaterial( {color: 0xf2f6d6} );
        let newBoid = new Boid(new THREE.Mesh( boidGeom, boidMat ));
        if (i >= numBoids)
            newBoid.setActive(false);
        let pos = randomSpherePoint(0,0,0,5);
        newBoid.mesh.position.set(pos[0], pos[1], pos[2]);
        scene.add(newBoid.mesh);
        boids.push(newBoid);
    }

    distanceTableSetup();

    distanceUpdateCounter = distanceUpdateDelay;
}

export function simulateBoids(deltaTime) {

    // Fill distance table at given interval
    if (distanceUpdateCounter === 0) {
        distanceUpdateCounter = distanceUpdateDelay+1;
        fillDistanceTable();
    }

    // React to number of active boids
    if (boidCountChanged) {
        numBoids = numBoidsBuffered;
        for (let i = 0; i < maxBoids; i++) {
            if (i < numBoids) {
                if (!boids[i].active)
                    boids[i].setActive(true);
            } else {
                if (boids[i].active)
                    boids[i].setActive(false);
            }
        }
        boidCountChanged = false;
    }

    // Simulate each boid
    for (let i = 0; i < numBoids; i++) {

        let fwdAdjust = new THREE.Vector3();
        fwdAdjust.add(boidFlock(i, 0.1));
        fwdAdjust.add(boidAlign(i, 0.1));
        fwdAdjust.add(boidAvoid(i));
        fwdAdjust.add(boidOrbit(i));

        boids[i].fwdDir.add(fwdAdjust);
        boids[i].fwdDir.clampLength(5, 10);
        const delta = boids[i].fwdDir.clone();
        delta.multiplyScalar(deltaTime);
        boids[i].mesh.position.add(delta);
        console.log(`boid: ${i} | ${boids[i].mesh.position.x} ${boids[i].mesh.position.y} ${boids[i].mesh.position.z}`);

        let pos = new THREE.Vector3();
        pos.addVectors(boids[i].fwdDir, boids[i].mesh.position);
        boids[i].mesh.lookAt(pos);
    }

    distanceUpdateCounter--;
}

// Behaviors

function boidFlock(boidIndex, weight) {

    let neighborCount = 0;
    let flockMeanPosition = new THREE.Vector3();
    
    // Accumulate # and positions of neighbors
    for (let i = 0; i < numBoids; i++) {
        
        // Ignore self
        if (i === boidIndex)
            continue;

        // Find neighbors
        if (getDistanceSqFromTable(boidIndex, i) < flockSqDistance) {
            neighborCount++;
            flockMeanPosition.add(boids[i].getPos());
        }
    }

    // Final math
    let directionAdjustment = new THREE.Vector3();
    if (neighborCount > 0) {
        flockMeanPosition.divideScalar(neighborCount);                                 // Calculate mean position of flock
        directionAdjustment.subVectors(flockMeanPosition, boids[boidIndex].getPos());  // Get position delta
        directionAdjustment.multiplyScalar(weight);                                    // Apply weights
    }
    return directionAdjustment;
}

function boidAlign(boidIndex, weight) {

    let neighborCount = 0;
    let flockMeanDirection = new THREE.Vector3();
    
    // Accumulate # and directions of neighbors
    for (let i = 0; i < numBoids; i++) {
        
        // Ignore self
        if (i === boidIndex)
            continue;

        // Find neighbors
        if (getDistanceSqFromTable(boidIndex, i) < alignSqDistance) {
            neighborCount++;
            flockMeanDirection.add(boids[i].fwdDir);
        }
    }
    
    // Final math
    let directionAdjustment = new THREE.Vector3();
    if (neighborCount > 0) {
        flockMeanDirection.divideScalar(neighborCount);                                // Calculate mean forward direction of flock
        directionAdjustment.subVectors(flockMeanDirection, boids[boidIndex].fwdDir);   // Get position delta
        directionAdjustment.multiplyScalar(weight);                                    // Apply weights
    }
    return directionAdjustment;
}

function boidAvoid (boidIndex) {

    let directionAdjustment = new THREE.Vector3();

        for (let i = 0; i < numBoids; i++) {
        
            // Ignore self
            if (i === boidIndex)
                continue;

            // Find neighbors
            const distanceSq = getDistanceSqFromTable(boidIndex, i);
            if (distanceSq < avoidSqDistance) {
                const deltaPos = new THREE.Vector3();
                deltaPos.subVectors(boids[boidIndex].getPos(), boids[i].getPos());
                directionAdjustment.add(deltaPos);
                directionAdjustment.divideScalar(distanceSq);
        }
    }
    
    return directionAdjustment;
}

function boidOrbit(boidIndex) {
    let correctDir = boids[boidIndex].fwdDir.projectOnPlane(boids[boidIndex].mesh.position);

    let directionAdjustment = new THREE.Vector3();
    directionAdjustment.subVectors(correctDir, boids[boidIndex].fwdDir);

    directionAdjustment.multiplyScalar(boids[boidIndex].mesh.position.length() - 5);

    return directionAdjustment;
}


// Helpers

function distanceTableSetup() {

    distanceTable = [];

    // Loop through all boids (except the first)
    for (let i = 0; i < maxBoids - 1; i++) {
        
        let distanceTableRow = [];

        // Set value at (i, j) unless (j, i) has already been set
        for (let j = 0; j < i; j++) {
            distanceTableRow.push(100);
        }
        distanceTable.push(distanceTableRow);
    }
}

function fillDistanceTable() {

    let boidAPos, boidBPos;

    // Loop through all boids (except the first)
    for (let i = 1; i < maxBoids; i++) {
        
        boidAPos = boids[i].getPos();

        // Set values until i === j
        for (let j = 0; j < i; j++) {
            boidBPos = boids[j].getPos();
            distanceTable[i-1][j] = boidAPos.distanceToSquared(boidBPos);
        }
    }
}

// Fetch values from the table, taking into account the table's formatting
function getDistanceSqFromTable(boidAIndex, boidBIndex) {
    if (boidAIndex === boidBIndex)
        return 0;                                      // Boid can't have distance to itself
    else if (boidAIndex < boidBIndex)
        return distanceTable[boidBIndex-1][boidAIndex];  // Swap indices to get the value
    else
        return distanceTable[boidAIndex-1][boidBIndex];  // Get value normally
}

function randomSpherePoint(x0,y0,z0,radius){
    var u = Math.random();
    var v = Math.random();
    var theta = 2 * Math.PI * u;
    var phi = Math.acos(2 * v - 1);
    var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
    var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
    var z = z0 + (radius * Math.cos(phi));
    return [x, y, z];
 }