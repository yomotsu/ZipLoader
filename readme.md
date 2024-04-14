# ZipLoader

ZipLoader is a light weight zip file loader and unzipper for Web browsers.
(only 25KB (gzipped 9KB) )

Plus, It makes easy to make loading progress bar.

[![Latest NPM release](https://img.shields.io/npm/v/zip-loader.svg)](https://www.npmjs.com/package/zip-loader)
![MIT License](https://img.shields.io/npm/l/zip-loader.svg)
[![dependencies Status](https://david-dm.org/yomotsu/ZipLoader/status.svg)](https://david-dm.org/yomotsu/ZipLoader)
[![devDependencies Status](https://david-dm.org/yomotsu/ZipLoader/dev-status.svg)](https://david-dm.org/yomotsu/ZipLoader?type=dev)

[Demos can be seen here](https://yomotsu.github.io/ZipLoader/examples/).

## Usage

Both standalone version and [NPM module](https://www.npmjs.com/package/zip-loader) version are available.

### Standalone

Copy zip-loader.js from `/dist/zip-loader.js` and place it in your project.
```html
<script src="./js/zip-loader.js"></script>
```

### NPM
```
$ npm install --save zip-loader
```

then
```javascript
import ZipLoader from 'zip-loader';
```

## To load and unzip

Make a loader instance with a target zip url. Then, `load()` it.

```javascript
const fetchOptions = { /* same as the second argument of `fetch()` */}
const loader = new ZipLoader( './foldername.zip', fetchOptions );
loader.load();
```

You can track the loading progress through the `'progress'` event.  
Once complete, the zip file is automatically unzipped, and the `'load'` event is triggered.  
As a result, the instance will include a `files` property, which contains the filename and binary buffer

```javascript
const loader = new ZipLoader( './foldername.zip' );

loader.on( 'progress', ( event ) => {

  console.log( 'loading', event.loaded, event.total );

} );

loader.on( 'load', ( event ) => {

  console.log( 'loaded!' );
  console.log( loader.files );

  const json = loader.extractAsJSON( 'foldername/data.json' );
  console.log( json );

} );

loader.on( 'error', ( event ) => {

  console.log( 'error', event.error );

} );

loader.load();
```

It also returns a `Promise`.

```javascript
const loader = new ZipLoader( './foldername.zip' );

await loader.load();

console.log( 'loaded!' );
console.log( loader.files );

const json = loader.extractAsJSON( 'foldername/data.json' );
console.log( json );
```

## unzip Blob/File directly

```javascript
const zipLoaderInstance = await ZipLoader.unzip( blobOrFile );
console.log( zipLoaderInstance.files );
```

## Pick up unzipped files

There are 3 (+1) ways to pick up unzipped files.

- as a text.
- as a JSON.
- as an URL (for `<img>`, `<audio>`, `<video>` etc).

The 1st augment is `key` of `loader.files` object, that represents "path + filename" in zipped folder.

### As a text

```javascript
const string = loader.extractAsText( 'foldername/text.txt' );
```

### As a JSON
```javascript
const json = loader.extractAsJSON( 'foldername/data.json' );
```

### As an URL

The 2nd arguments is its MIMEType.

```javascript
const url = loader.extractAsBlobUrl( 'foldername/pict.jpg', 'image/jpeg' );
```

## Clear cache

After the buffer is unzipped, the loader instance will store the data.  
When the data is no longer needed, you can clear the stored cache.

To clear single cache
```javascript
myImg.onload = () => {

  loader.clear( 'foldername/pict.jpg' );

}
```

To clear all cache (sort of its destructor)
```javascript
loader.clear();
```
