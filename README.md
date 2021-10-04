Michael's Simple Piano and Percussion Ensemble

Website hosted at: https://a4-michaelrossetti.glitch.me/

For this assignment I took some inspiration from my previous music classes.
I am not the greatest composer, but I have done projects in Max and wanted to
create somthing that looked similar to an interface you could create. The goal
of my project was to implement a simple piano keyboard playing notes from C4 to
C6 and to add percussion or a beat that could go along with it.

The piano is created using the NexusUI javascript file and the values are converted
and played with Tone from C4 to C6. The values of the keyboard are the MIDI values of
these notes therefore the keyboard starts at 60 and ends at 85.

The percussion is implemented using a sequencer that play a specified beat when the
button is toggled. By editing the percussion value, one is able to change the sound
made by the sequence. The sequencer plays all notes as 8th notes.

Although there are not any written instructions, through the labels and clicking the
buttons, anyone could easily find out how to use the site.

One of the main challenges I faced was getting Tone.js to work. I do not know why this is
in retrospect, but in my early implementation I could not get the javascript to load and work
with the webpage. After fixing the issue, I created an array to handle the notes I wanted and
everything began to work smoothly from there.