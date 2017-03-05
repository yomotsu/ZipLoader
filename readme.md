# ZipLoader

![](./examples/logo.png)

ZipLoader is a light weight zip file loader and unzipper  for Web browsers.
(only 25KB (gzipped 9KB) )

[Demos can be seen here](./examples/index.html).

## Usage

Both standalone library version and NPM module version are available.

### Standadone

Copy ZipLoader.js from /dist/ZipLoader.js and place it in your project.
```
<script src="./js/ZipLoader.js"></script>
```

### NPM
```
$ npm i -save zip-loader
```

then
```
import ZipLoader from 'zip-loader';
```

## To load and unzip

Make a loader instance with a target zip url. Then, `load()` it.

```
var loader = new ZipLoader( './foldername.zip' );
loader.load();
```

You can get loading progress in `'progress'` event while loading.

When it's done, the zip file will be automatically unzipped and `'load'` event will be triggered.

As the result, you will get `files` property under the instance, that consists of filename and binary data.

```
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
```

## Pick up unzipped files

There are 3 (+1) ways to pick up unzipped files.

- as a text.
- as a JSON.
- as an URL (for `<img>`, `<audio>`, `<video>` etc).

The 1st augment is `key` of `loader.files` object, that represents "path + filename" in zipped folder.

### As a text

```
var string = loader.extractAsText( 'foldername/text.txt' );
```

### As a JSON
```
var json = loader.extractAsJSON( 'foldername/data.json' );
```

### As an URL

The 2nd augument is its MIMEType.

```
var url = loader.extractAsBlobUrl( 'foldername/pict.jpg', 'image/jpeg' );
```

---

## with three.js

ZipLoader can provide altanative JSONLoader for zipped JSON.

```
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
