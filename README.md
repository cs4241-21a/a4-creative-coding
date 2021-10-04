## Audio Visualizer

http://a4-nicholasmarkou.glitch.me

This project is a website that uses an express server to serve the website. The site itself uses a simple html page with a significant amount of javascript to draw on a canvas by using audio and its frequencies to create a visualization of the sound. The user can manipulate the canvas by switching the audio source (WROR-FM is my favorite and a live broadcast), add a multiplier to the frequencies to create larger spikes, change the colors, volume and the size of the canvas. This results in a visualization of the audio where the user can control a significant amount of the visualization process.

Most of the challenges were at the beginning of the project. It took me a while to figure out how to get the audio to properly play, in addition with how to get the frequnecy data from it. Once I got past this, the only other challenge was visualizing the audio. After a lot of trial and error, I learned how to properly draw to the canvas, such as covering the entire canvas each frame before adding the frequency data. I found tweakpane easy to setup and had all user inputs done very quickly using it.