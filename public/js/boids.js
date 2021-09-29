import * as THREE from 'https://unpkg.com/three/build/three.module.js';

const numBoids = 3;
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
let distanceUpdateDelay = 0;   // How many cycles to wait before updating distance table
let distanceUpdateCounter = 0; // Counts down each cycle from update delay ^

const geometry = new THREE.ConeGeometry( 0.5, 1, 4 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

function Boid(mesh) {
    this.speed = 1;
    this.mesh = mesh;
    this.getPos = (() => this.mesh.position);
    this.setPos = (pos => {
                        this.mesh.position = pos;
                    });
    this.fwdDir = new THREE.Vector3(0, 0, 1);
    this.setFwdDir = (dir => {
                        this.fwdDir = dir;
                        let pos = this.mesh.position;
                        pos.add(dir);
                        this.mesh.lookAt(pos);
                    });
}

export function boidsSetup(scene) {
    for (let i = 0; i < numBoids; i++) {
        let newBoid = new Boid(new THREE.Mesh( geometry, material ));
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

    // Loops through all boids
    for (let i = 0; i < numBoids; i++) {
        
        let fwdAdjust = new THREE.Vector3();
        //fwdAdjust.add(boidFlock(i, 5, 0.03));
        //fwdAdjust.add(boidAlign(i, 5, 0.2));
        //fwdAdjust.add(boidAvoid(i, 1, 0.01));

        fwdAdjust.add(boids[i].fwdDir);
        //fwdAdjust.clampLength(0, 10);
        console.log(`Boid ${i} sq vel: ${fwdAdjust.lengthSq()}`);
        boids[i].setFwdDir(fwdAdjust);
        fwdAdjust.multiplyScalar(deltaTime);
        boids[i].mesh.position.add(fwdAdjust);
    }

    distanceUpdateCounter--;
}

// Behaviors

function boidFlock(boidIndex, distanceSqThreshold, weight) {

    let neighborCount = 0;
    let flockMeanPosition = new THREE.Vector3();
    
    // Accumulate # and positions of neighbors
    for (let i = 0; i < numBoids; i++) {
        
        // Ignore self
        if (i === boidIndex)
            continue;

        // Find neighbors
        if (getDistanceSqFromTable(boidIndex, i) < distanceSqThreshold) {
            neighborCount++;
            flockMeanPosition.add(boids[i].getPos());
        }
    }

    // Final math
    flockMeanPosition.divideScalar(neighborCount);                             // Calculate mean position of flock
    let directionAdjustment = new THREE.Vector3();
    directionAdjustment.subVectors(flockMeanPosition, boids[boidIndex].getPos());   // Get position delta
    directionAdjustment.multiplyScalar(weight);                                // Apply weights
    return directionAdjustment;
}

function boidAlign(boidIndex, distanceSqThreshold, weight) {

    let neighborCount = 0;
    let flockMeanDirection = new THREE.Vector3();
    
    // Accumulate # and directions of neighbors
    for (let i = 0; i < numBoids; i++) {
        
        // Ignore self
        if (i === boidIndex)
            continue;

        // Find neighbors
        if (getDistanceSqFromTable(boidIndex, i) < distanceSqThreshold) {
            neighborCount++;
            flockMeanDirection.add(boids[i].fwdDir);
        }
    }
    
    // Final math
    flockMeanDirection.divideScalar(neighborCount);                                // Calculate mean forward direction of flock
    let directionAdjustment = new THREE.Vector3();
    directionAdjustment.subVectors(flockMeanDirection, boids[boidIndex].fwdDir);   // Get position delta
    directionAdjustment.multiplyScalar(weight);                                    // Apply weights
    return directionAdjustment;
}

function boidAvoid (boidIndex, distanceSqThreshold, weight) {

    let directionAdjustment = new THREE.Vector3();

        for (let i = 0; i < numBoids; i++) {
        
        // Ignore self
        if (i === boidIndex)
            continue;

        // Find neighbors
        if (getDistanceSqFromTable(boidIndex, i) < distanceSqThreshold) {
            const closeness = distanceSqThreshold - getDistanceSqFromTable(boidIndex, i);
            const scaledDeltaPos = new THREE.Vector3();
            scaledDeltaPos.subVectors(boids[boidIndex].getPos(), boids[i].getPos());
            scaledDeltaPos.multiplyScalar(closeness);
            directionAdjustment.add(scaledDeltaPos);
        }
    }
    
    // Final math
    directionAdjustment.multiplyScalar(weight);  // Apply weights
    return directionAdjustment;
}


// Helpers

function getDistanceSq(posA, posB) {
    return (posA.x * posB.x) + (posA.y * posB.y) + (posA.z * posB.z);
}

function distanceTableSetup() {

    distanceTable = [];

    // Loop through all boids (except the first)
    for (let i = 0; i < numBoids - 1; i++) {
        
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
    for (let i = 1; i < numBoids; i++) {
        
        boidAPos = boids[i].getPos();

        // Set values until i === j
        for (let j = 0; j < i; j++) {
            boidBPos = boids[j].getPos();
            distanceTable[i-1][j] = getDistanceSq(boidAPos, boidBPos);
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