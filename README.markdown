Assignment 4 - Creative Coding
===
http://a4-owen-blaufuss.glitch.me

An interactive bar graph to explore the lyrical volume of the band They Might Be Giants over time.

NOTE: The lyrics are stored as a large number of small files. They are only requested once, on page load, but Glitch doesn't seem to like this volume of requests; refreshing the page many times back to back may result in being rate-limited.

Requirements
------------
- Server, created using Express
- [D3.js](https://d3js.org)
- User interface wtih following parameters:
    - X axis display radio button choices
    - X axis display album name dropdown list
    - Y axis display radio button choices
    - Y axis display custom search box

Challenges
----------
- Due to the format in which the lyrics were downloaded, a large volume of network requests is made on page load. Making this happen efficiently and ensuring that all these requests had finished before display was a bit of a challenge.
- The lengths and formatting of different songs and albums was difficult to predict and work around. To avoid having to make major changes for edge cases, an alternate solution, hovertext on each bar, was used as a label.

Special thanks:
-----------
- [TMBW](https://tmbw.net), the They Might Be Giants wiki
- [TMBotG's web scraper](https://github.com/bgporter/tmbotg), for collecting the lyrics 