lofi pitter patters to study to
===
*author:* jyalu wu

*assignment:* assignment 4 - creative coding: interactive multimedia experiences

*website links:*

[site hosted on glitch](https://a4-jyalu-wu.glitch.me/)

===

Due: October 4th, by 11:59 AM.

For this assignment we will focus on client-side development using popular audio/graphics/visualization technologies. The goal of this assignment is to refine our JavaScript knowledge while exploring the multimedia capabilities of the browser.

[WebAudio / Canvas / Three Tutorial](https://github.com/cs4241-21a/cs4241-21a.github.io/blob/main/webaudio_canvas_three.md)  
[SVG + D3 tutorial](https://github.com/cs4241-21a/cs4241-21a.github.io/blob/main/using_svg_and_d3.md)  

Baseline Requirements
---

Your application is required to implement the following functionalities:

- A server created using Express. This server can be as simple as needed.
- A client-side interactive experience using at least one of the following web technologies frameworks.
  - [Three.js](https://threejs.org/): A library for 3D graphics / VR experiences
  - [D3.js](https://d3js.org): A library that is primarily used for interactive data visualizations
  - [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API): A 2D raster drawing API included in all modern browsers
  - [SVG](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API): A 2D vector drawing framework that enables shapes to be defined via XML.
  - [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API): An API for audio synthesis, analysis, processing, and file playback.
- A user interface for interaction with your project, which must expose at least four parameters for user control. [tweakpane](https://cocopon.github.io/tweakpane/) is highly recommended for this, but you can also use regular HTML `<input>` tags (the `range` type is useful to create sliders). You might also explore interaction by tracking mouse movement via the `window.onmousemove` event handler in tandem with the `event.clientX` and `event.clientY` properties. Consider using the [Pointer Events API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) to ensure that that both mouse and touch events will both be supported in your app.
- Your application should display basic documentation for the user interface when the application first loads.

The interactive experience should possess a reasonable level of complexity. Some examples:
### Three.js
- A generative algorithm creates simple agents that move through a virtual world. Your interface controls the behavior / appearance of these agents.
- A simple 3D game... you really want this to be a simple as possible or it will be outside the scope of this assignment.
- An 3D audio visualization of a song of your choosing. User interaction should control aspects of the visualization. 
### Canvas
- Implement a generative algorithm such as [Conway's Game of Life](https://bitstorm.org/gameoflife/) (or 1D cellular automata) and provide interactive controls. Note that the Game of Life has been created by 100s of people using <canvas>; we'll be checking to ensure that your implementation is not a copy of these.
- Design a 2D audio visualizer of a song of your choosing. User interaction should control visual aspects of the experience. 
### Web Audio API
- Create a screen-based musical instrument using the Web Audio API. You can use projects such as [Interface.js](http://charlie-roberts.com/interface/) or [Nexus UI](https://nexus-js.github.io/ui/api/#Piano) to provide common musical interface elements, or use dat.GUI in combination with mouse/touch events (use the Pointer Events API). Your GUI should enable users to control aspects of sound synthesis. If you want to use higher-level instruments instead of the raw WebAudio API sounds, consider trying the instruments provided by [Tone.js]() or [Gibber](https://github.com/charlieroberts/gibber.audio.lib).
### D3.js
- Create visualizations using the datasets found at [Awesome JSON Datasets](https://github.com/jdorfman/Awesome-JSON-Datasets). Experiment with providing different visualizations of the same data set, and providing users interactive control over visualization parameters and/or data filtering. Alternatively, create a single visualization with using one of the more complicated techniques shown at [d3js.org](d3js.org) and provide meaningful points of interaction for users.

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements.
3. Test your project to make sure that when someone goes to your main page on Glitch/Heroku/etc., it displays correctly.
4. Ensure that your project has the proper naming scheme `a4-firstname-lastname` so we can find it.
5. Fork this repository and modify the README to the specifications below. *NOTE: If you don't use Glitch for hosting (where we can see the files) then you must include all project files that you author in your repo for this assignment*.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a4-firstname-lastname`.

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title

your hosting link e.g. http://a4-charlieroberts.glitch.me

Include a very brief summary of your project here. Images are encouraged when needed, along with concise, high-level text. Be sure to include:

description
---
this website allows you to listen to chill lofi rain sounds and lofi beats while you study or code or do art or grade this assignment. you can choose the level of rain you want to listen to, whether or not you want lofi music in the background, what environment you want to be in, and also what name you want to give your playlist. a table showing your track mix history is shown on the right, and the user is able to delete old mixes they don't want anymore. on the botton of the site, you can see a visualization of the rain sounds that are playing at any given moment. in addition, the "mute" and "stop" buttons allow you to control the sounds.

functionalities
---
- an express server
- interactive site using canvas and web audio api
- parameters for user control of the visualization: sound (rain and lofi), color (background image), mute, and stop

challenges
---
- for previous iterations of this project i used howler.js instead of web audio. getting the visualization to connect to the sounds playing from howler.js instead of converting everything to web audio was really tricky. eventually i got it to work after discovering that the howler api exposes the webaudio context for web api.
- the biggest challenge was that i didn't have a lot of time to work on this assignment. i was out of town for personal/family reasons and found it difficult to find time to sit down and work on this project. i think that some requirements are missing.

resources
---
- home wallpaper: https://wallpapercave.com/w/wp6192898
- car wallpaper: https://wallpapercave.com/w/wp4918883
- train wallpaper: https://wallpapercave.com/w/wp4334662
- forest wallpaper: https://wallpapercave.com/w/wp4649496

- rain sounds: https://mixkit.co/free-sound-effects/rain/

- howler.js: https://howlerjs.com/
- visualization code: https://github.com/cs4241-21a/cs4241-21a.github.io/blob/main/webaudio_canvas_three.md

- skeleton css framework: http://getskeleton.com

- lofi music:
Green Tea by Purrple Cat | https://purrplecat.com/
Music promoted on https://www.chosic.com/
Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
https://creativecommons.org/licenses/by-sa/3.0/
