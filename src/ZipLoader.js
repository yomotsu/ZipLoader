import parseZip from './parseZip.js';
import PromiseLike from './PromiseLike.js';
let count = 0;
let THREE;

const ZipLoader = class ZipLoader {

	static unzip( blobOrFile ) {

		return new PromiseLike( ( resolve ) => {

			const instance = new ZipLoader();
			const fileReader = new FileReader();

			fileReader.onload = ( event ) => {

				const arrayBuffer = event.target.result;
				instance.files = parseZip( arrayBuffer );
				resolve( instance );

			};

			if ( blobOrFile instanceof Blob ) {

				fileReader.readAsArrayBuffer( blobOrFile );

			}

		} );

	}

	constructor( url ) {

		this._id = count;
		this._listeners = {};
		this.xhr = null;
		this.url = url;
		this.files = null;
		count ++;

	}

	load() {

		return new PromiseLike( ( resolve ) => {

			const startTime = Date.now();
			const xhr = this.xhr = new XMLHttpRequest();
			xhr.open( 'GET', this.url, true );
			xhr.responseType = 'arraybuffer';

			xhr.onprogress = ( e ) => {

				this.dispatch( {
					type: 'progress',
					loaded: e.loaded,
					total: e.total,
					elapsedTime: Date.now() - startTime
				} );

			};

			xhr.onload = () => {

				this.files = parseZip( xhr.response );
				this.dispatch( {
					type: 'load',
					elapsedTime: Date.now() - startTime
				} );
				resolve();

			};

			xhr.onerror = ( event ) => {

				this.dispatch( {
					type: 'error',
					error: event
				} );

			};

			xhr.send();

		} );

	}

	extractAsBlobUrl( filename, type ) {

		if ( this.files[ filename ].url ) {

			return this.files[ filename ].url;

		}

		const blob = new Blob( [ this.files[ filename ].buffer ], { type: type } );
		this.files[ filename ].url = URL.createObjectURL( blob );
		return this.files[ filename ].url;

	}

	extractAsText( filename ) {

		const buffer = this.files[ filename ].buffer;

		if ( typeof TextDecoder !== 'undefined' ) {

			return new TextDecoder().decode( buffer );

		}

		let str = '';

		for ( let i = 0, l = buffer.length; i < l; i ++ ) {

			str += String.fromCharCode( buffer[ i ] );

		}

		return decodeURIComponent( escape( str ) );

	}

	extractAsJSON( filename ) {

		return JSON.parse( this.extractAsText( filename ) );

	}

	loadThreeJSON( filename ) {

		const json = this.extractAsJSON( filename );
		const dirName = filename.replace( /\/.+\.json$/, '/' );
		const pattern = `__ziploader_${ this._id }__`;
		const regex   = new RegExp( pattern );

		if ( ! THREE.Loader.Handlers.handlers.indexOf( regex ) !== - 1 ) {

			THREE.Loader.Handlers.add(
				regex,
				{
					load: ( filename ) => {

						return this.loadThreeTexture( filename.replace( regex, '' ) );

					}
				}
			);

		}

		return THREE.JSONLoader.prototype.parse( json, pattern + dirName );

	}

	loadThreeTexture( filename ) {

		const texture = new THREE.Texture();
		const type = ( /\.jpg$/ ).test( filename ) ? 'image/jpeg' :
		             ( /\.png$/ ).test( filename ) ? 'image/png' :
		             ( /\.gif$/ ).test( filename ) ? 'image/gif' :
		             undefined;
		const blob = new Blob( [ this.files[ filename ].buffer ], { type: type } );

		const onload = () => {

			texture.needsUpdate = true;
			texture.image.removeEventListener( 'load', onload );
			URL.revokeObjectURL( texture.image.src );

		};

		texture.image = new Image();
		texture.image.addEventListener( 'load', onload );
		texture.image.src = URL.createObjectURL( blob );
		return texture;

	}

	on( type, listener ) {

		if ( ! this._listeners[ type ] ) {

			this._listeners[ type ] = [];

		}

		if ( this._listeners[ type ].indexOf( listener ) === - 1 ) {

			this._listeners[ type ].push( listener );

		}

	}

	off( type, listener ) {

		const listenerArray = this._listeners[ type ];

		if ( !! listenerArray ) {

			const index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	}

	dispatch( event ) {

		const listenerArray = this._listeners[ event.type ];

		if ( !! listenerArray ) {

			event.target = this;
			const length = listenerArray.length;

			for ( let i = 0; i < length; i ++ ) {

				listenerArray[ i ].call( this, event );

			}

		}

	}

	clear( filename ) {

		if ( !! filename ) {

			URL.revokeObjectURL( this.files[ filename ].url );
			delete this.files[ filename ];
			return;

		}

		for ( let key in this.files ) {

			URL.revokeObjectURL( this.files[ key ].url );

		}

		delete this.files;

		if ( !! THREE ) {

			const pattern = `__ziploader_${ this._id }__`;

			THREE.Loader.Handlers.handlers.some( ( el, i ) => {

				if ( el instanceof RegExp && el.source === pattern ) {

					THREE.Loader.Handlers.handlers.splice( i, 2 );
					return true;

				}

			} );

		}

	}

	static install( option ) {

		if ( !! option.THREE ) {

			THREE = option.THREE;

		}

	}

};

export default ZipLoader;
