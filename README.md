## Virtual Synth Keyboard

https://a4-alan-healy.glitch.me/

This application is a simple synthesizer with piano keyboard controls. It provides a simple interface with 5 aspects of user input: pitch, gain, panning, wave type, and low pass filtering. It uses the default Web Audio API, and uses UI elements from the NexusUI API.

One of the main challenges I faced while creating the application was handling the audio clicking noise that can occur if an oscillator is turned off when not at a zero crossing.
To address this, I used an exponential fade to 0.001 on the main gain node before stopping any oscillator. This successfully reduced the audio clicking. 
However, some of this clicking can still occur if the user clicks and quickly drags across the piano keyboard.