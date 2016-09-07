# Viewpoints
[Viewpoints](http://iopscience.iop.org/article/10.1086/657902/pdf) is an open source desktop tool written in c++ for visualizing high dimensionality data using linked scatter plots. This repo is a re-implementation of Viewpoints as a web application, making heavy use of WebGL.

Viewpoints is compatible with any type of CSV. It can graph numerical and categorical data together on a single set of axes and offers configurable overplotting features to enhance density estimation.

![Stars by Color](http://i.imgur.com/99tcXDk.jpg "Stars by Color")

# To Preview:

Try it out [live!](https://planetlabs.github.io/viewpoints/)

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

