Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===

## Color Swatch

Link: [linkhere](linkhere)

NOTE: The professor gave me an extension to work on this due to family business that came up over the weekend.

The goal of this application was to create a color picker with sliders that uses Canvas to display the color. This application can display both the RGBA and hex values (calculated in the Javascript end of things) of the color. I personally strongly prefer using RGBA sliders to pick my colors because of the way I initially learned light-based color theory, so I will definitely continue to use this tool in the future.

The inputs controlled by the user in this application include red, green, blue, and alpha values.

I struggled for a while in getting the Canvas component to recognize the input color - initially, I was trying to use hexVal (the string containing the hex value), but for some reason that I still can't figure out, fillStyle would not read that particular string. Like a fool, I didn't think to use the console to diagnose my issue, so I chalked it up to the sliders not being read correctly for way too long. Once I realized the issue, however, I found a workaround by setting the fillStyle to a string that included the variables in RGB format.

I had another issue for a while with reading the alpha value. It would only change when going to or from 0. In order to debug, I added several console statements, all of which printed correctly. I ended up moving a lot of code around to make it more effective and to see if that would fix things. In the end, it turned out that the alpha used 0-1, and I am just a complete buffoon.

The usage of this website should be relatively straightforward: adjust the sliders labeled R, G, and B using your mouse. Alternatively, clicking on the corresponding slider and using the keyboard arrows is also accepted.