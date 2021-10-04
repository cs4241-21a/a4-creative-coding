Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===

## Meteorite Landings

Glitch link: https://a4-victoria-grasso.glitch.me/

- The goal of this application was to work with D3 to create visualizations about meteorite landings on Earth. The data came from this json file: https://data.nasa.gov/resource/y77d-th95.json which I got from Awesome JSON datasets: https://github.com/jdorfman/Awesome-JSON-Datasets.
- The challenges I faced included learning the D3 syntax and how to filter the json data to update the visualization. I also had a hard time creating a tooltip for the last visualization, and was unable to get the tooltip to display. However, I figured out how to use mouseover to display which bar I was hovering over and printed that to the console.
- There are two visualizations displayed. The first visualization is more in-depth and shows the relative mass of the different meteorite landings. Since many meteorites were extremely large, I scaled down the radius of the circles to display the different meteorites. The first visualization is connected to the tweakpane and changes based on those parameters. Note: the minimum parameter only works when the all type parameter is selected due to the scaling of the circle radiuses. The second visualization is a bar plot that shows the difference in how many meteorites were seen falling versus just found. The tweakpane color parameter changes the color of the bars.
