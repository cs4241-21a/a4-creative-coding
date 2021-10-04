Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===

## Minimum Wage by State Visualization

Hosting Link: http://a4-pai-ashwin.glitch.me

For A4 Creative Coding Assignment I chose to use the D3 Library. 
For my project I created 2 visualizations based on a minimum wage per state infographic. The first visualization is an 
interactive map, and the second visualization is a linked visualization which displays a state's minimum wage on a bar 
graph below the map of the states. 

![img](imgs/finalScreenshot.png)
### Points of Interaction Used: 
1. Hover on State for Map: The first point of interaction included is the ability for a user to hover over a state and see the states name along with the minimum wage. 
2. Click on State to Highlight: The second point of interaction included is the ability for a user to select a state by clicking on it. Clicking on the state does the following 2 things: 
   1. Highlights the state on the map (bolder)
   2. Adds the map to the linked bar-graph visualization. 
3. Select All States at Once and Populate Bar Graph: The third point of interaction is the ability to select all the states at one for an easier comparison. To do this simply click the blue box found in the top left of the map. 
4. Deselect All States and Clear Bar Graph: THe fourth interaction used is the ability for user to clear all entry's off the map and bar graph by clicking the red box (next to the blue box)

The goal of the application was to learn about using maps in D3, primarily because it seemed complicated. In addition, I thought it would be interested to creat
a linked visualization that could better explain the same data I was trying to present. Since the map can only show a range of wages, the bar-graph 
gives a better representation of the comparison between states. 

One challenge/feature I wish I had the time to implement was to create a series of checkboxes that allowed a user to highlight a portion of the map by region. 
For example, a checkbox titled NorthEast could be checked, and the New England Region of the map and bar graph would be highlighted.
