# ZipLoader

[![Latest NPM release](https://img.shields.io/npm/v/zip-loader.svg)](https://www.npmjs.com/package/zip-loader)
![MIT License][https://img.shields.io/npm/l/zip-loader.svg]

ZipLoader is a light weight zip file loader and unzipper for Web browsers.
(only 25KB (gzipped 9KB) )

Plus, It makes easy to make loading progress bar.

[Demos can be seen here](https://yomotsu.github.io/ZipLoader/examples/).

## Usage

Both standalone version and [NPM module](https://www.npmjs.com/package/zip-loader) version are available.

### Standalone

Copy ZipLoader.js from `/dist/ZipLoader.js` and place it in your project.
```html
<script src="./js/ZipLoader.js"></script>
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
var loader = new ZipLoader( './foldername.zip' );
loader.load();
```

You can get loading progress in `'progress'` event while loading.

When it's done, the zip file is automatically unzipped and `'load'` event will be triggered.

As the result, you will get `files` property under the instance, that consists of filename and binary data.

```javascript
var loader = new ZipLoader( './foldername.zip' );

loader.on( 'progress', function ( e ) {

  console.log( 'loading', e.loaded, e.total );

} );

loader.on( 'load', function ( e ) {

  console.log( 'loaded!' );
  console.log( loader.files );
  
  var json = loader.extractAsJSON( 'foldername/data.json' );
  console.log( json );

} );

loader.load();
```

## Pick up unzipped files

There are 3 (+1) ways to pick up unzipped files.

- as a text.
- as a JSON.
- as an URL (for `<img>`, `<audio>`, `<video>` etc).

The 1st augment is `key` of `loader.files` object, that represents "path + filename" in zipped folder.

### As a text

```javascript
var string = loader.extractAsText( 'foldername/text.txt' );
```

### As a JSON
```javascript
var json = loader.extractAsJSON( 'foldername/data.json' );
```

### As an URL

The 2nd arguments is its MIMEType.

```javascript
var url = loader.extractAsBlobUrl( 'foldername/pict.jpg', 'image/jpeg' );
```

---

## with three.js

ZipLoader can provide altanative JSONLoader for zipped JSON.

```javascript
// At first, prepare to use THREE.js in ZipLoader
ZipLoader.use( { 'THREE': THREE } );

var loader = new ZipLoader( './assets.zip' );

loader.on( 'load', function ( e ) {

  var result = loader.loadThreeJson( 'assets/threejs-model.json' );

  var mesh = new THREE.Mesh(
    result.geometry,
    new THREE.MultiMaterial( result.materials )
  );

  scene.add( mesh );

} );
```


## Clear cache

After unzipped, loader instance will store the data.
When you don't need the data, you can clear stored cache.

To clear single cache
```javascript
myImg.onload = function () {

  loader.clear( 'foldername/pict.jpg' );

}
```

To clear all cache (sort of its destructor)
```javascript
loader.clear();
```
