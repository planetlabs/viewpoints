# Viewpoints
[Viewpoints](http://iopscience.iop.org/article/10.1086/657902/pdf) is an open source desktop tool, developed at NASA, for visualizing high dimensionality data using linked scatter plots. This repo is a re-implementation of Viewpoints as a web application, making heavy use of WebGL.

![In Action](http://i.imgur.com/h8ARjzU.gif "In Action")

## Features

#### Large Data Sets
Viewpoints is designed to handle extremely large data sets such as the entire Tycho Catalog--over 1 million stars. When all stars are graphed using declination vs right ascesion, you can see the structure of the Milky Way.

![The Milky Way](http://i.imgur.com/dsUIqva.jpg "The Milky Way")

#### Pan and Zoom

To Pan: click and drag while holding `⌘` (Windows use `windows key`)

To Zoom, click and drag while holding `alt` (Windows use `ctrl`).

![The Milky Way, Zoomed](http://i.imgur.com/ep58Wi4.jpg "The Milky Way, Zoomed")


#### Linked Highlighting

The primary feature of Viewpoints is that highlighting points on one graph will highlight those same points on all other graphs. This allows for deep data exploration and the discovery of trends that would otherwise not be visible.

For example, if we highlight just the stars of a certain color (the bottom quartile of the bottom left graph), we find that they preferentially appear in the central disk of the galaxy and not in the periphery:

![Star Location and Color](http://i.imgur.com/EylXYCM.jpg "Star Location and Color")

Alternatively, if we highlight just the stars with a high error in their right ascension measurement (right side of the bottom right graph), we tease out the precessing circles that characterize the observation pattern of the telescopes that created the catalog.

![Precessing Circles](http://i.imgur.com/aS3uQT4.jpg "Precessing Circles")

#### CSV Compatibility

This implementation is compatible with any type of CSV provided the first line contains the column headers.

# To Preview:

Try it out [live!](https://planetlabs.github.io/viewpoints/)

When the page loads you'll see a button to upload a csv file. There are several interested data sets curated [here](https://github.com/MattFerraro/csv) and many more [here](https://catalog.data.gov/dataset?res_format=CSV)

# To Run:

```
git clone https://github.com/planetlabs/viewpoints.git
cd viewpoints
export NODE_ENV=production    # optional, but makes it run faster by not doing React's Proptype checks
npm install
npm start
```
Then open up a browser to
```
localhost:3000
```

