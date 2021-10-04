# A4: Creative Coding

https://a4-jhsul.glitch.me

For this homework I made a visualizer for audio files. It uses a copy of Gangnam Style as the audio source. For me, my biggest challenge was getting snowpack to work with this, since I've never used it before and didn't realize that it replaces express for static files. Because I used only static files, I don't have my own express server.

There are 3 ways the user can control the scene:

- Play/pause the song
- Change foreground color
- Change background color

The user can change foreground and background colors by typing in any CSS-compliant color string. For instance, `rgb(255, 0, 0)`, or `#00ff00` are valid. If the input string is not compliant, the color will not change.
