## Spheralizer
Nathan Klingensmith https://a4-iamparadoxdotexe.glitch.me/

This website utilizes `three.js` and the `WebAudio API` to visualize songs onto a sphere through frequency analysis.

##### *Goal*
The goal of the application is to allow users to experiment with the spherical visualization of different songs.

##### *Challenges*
One of the challenges in building this application was using the frequency data pulled through the `WebAudio API` to create a visually-pleasing modulation effect on the sphere.
I started by reducing the frequency data to the normalized averages of the high and low frequencies, but using those values to interpolate the sphere was difficult.

For the treble, I ended up using a 3D noise map from `Simplex` to create a flowing pattern across the sphere and then scaled its magnitude by the high frequencies of the song.
This took a lot of trial and error to get working right, but came out with the effect I was hoping for.
For the bass, I used a simpler magnitude increase to the overall size of the sphere to create a pulsing beat effect.
Combining these two effects was used to create the final visualization.

Another challenge I faced was figuring out how to redraw the sphere after each frame using `three.js`.
After diving through all the variables that make up the spherical mesh, I found the `position` attribute that lists the position of every vertex in a 1D array.
To update the sphere, I was able to iterate through this array in steps of 3 to collect each vertex in 3D space.
This let me compute the new `position` array by normalizing each vertex to its base state and calculating its new magnitude.
