# Simple node upload example

An endpoint to upload an image file, given a valid token in a request header

### Getting started

Copy the .env.example file to .env and set the values as required.

Make sure you have node and npm (or yarn) installed.

```
npm install
node app.js
```

will install and run the app.

## Alternative - Using Docker

```
docker build -t node-file-upload .
docker run -p 3000:3000 -d node-file-upload
```
