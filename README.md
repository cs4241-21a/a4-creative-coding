## Super Mario Music Maker!

https://glitch.com/edit/#!/a4-creative-coding

This project, for the a4 creative coding assignment, uses the Web Audio API to manipulate audio files, such as
Mario saying "It's a-me!  Mario!" in accordance with how the user wants.  The user can use sliders to bring the
volume up or bring the volume down.  They can also use a slider to weight the audio towards the left speaker or weight
the audio towards the right speaker (assuming they have stereo-capable hardware).  They can also enter their username
along with the name of their favorite song, both of which will be stored on an express server and displayed.

My biggest challenge in this project was fighting Google and the SEC.  This is because google won't let you
play audio files by default on sites through the HTML (https://developer.chrome.com/blog/autoplay/#webaudio),
which made testing this virtually impossible.  I sure hope you find the sound to be working on your machine,
because as far as I can tell stepping through my code I have all the infrastructure in place for a working
project from the script down to the assets but have no way of confirming it's cool.  And no, I refuse to reinstall 
Edge after what Microsoft did to me.

With that in mind, I hope you enjoy the beautiful ASMR of your own design at your disposal, assuming you would've
designed the ASMR to consist entirely of Mario sayiny "It's a-me! Mario!" at various volumes and audio-pan positions.

Also, I did a fork for the a4-components as well, which I will not attempt to submit.  This is my a4.