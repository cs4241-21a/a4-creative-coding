## Boid-o-sphere
CS 4241 - A4: Creative coding
Matt Johannesen - m-d-jo
Site: http://a4-matt-johannesen.glitch.me

### Summary
I made an implementation of boids, agents that follow a simple flocking algorithm:
- Move toward neighboring boids
- Point in the same direction as neighbors
- Move away from neighbors if they're too close
- Attempt to orbit around a sphere (my added rule)

Each of these behaviors is affected by the distance each boid checks within for neighbors - so I made an interface to let users control those thresholds, and see the outcomes.

### Challenges
The largest challenge of this project was debugging the vector math.  I understood the basic concepts of how boids worked, but translating those operations into three.js Vector3 commands took significant trial and error to get working.  I frequently ran into undefined numbers, passed references that I thought were passed *values*, and boids flipping back and forth repeatedly.  Ultimately, I was able to get a working prototype you can see on the site.
