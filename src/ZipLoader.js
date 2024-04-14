import { parseZip } from './parseZip.js';

/**
 * @class ZipLoader
 * @classdesc A class for loading and extracting files from a ZIP archive.
 */
const ZipLoader = class ZipLoader {

	/**
	 * @function
	 * @description Loads a zip archive from a File or Blob object and returns a Promise that resolves with a new ZipLoader instance
	 * @param {Blob|File} blobOrFile - The Blob or File object to load
	 * @returns {Promise<ZipLoader>}
	 */
	static unzip( blobOrFile ) {

		return new Promise( ( resolve ) => {

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

	/**
	 * @constructor
	 * @param {string} url
	 * @param {RequestInit} fetchOptions
	 */
	constructor( url, fetchOptions = {} ) {

		/** @private */
		this._listeners = {};

		/** @type {String|undefined} */
		this.url = url;

		/** @type {RequestInit} */
		this.fetchOptions = fetchOptions;

		/** @type {import('./types.ts').Files | null} */
		this.files = null;

	}

	/**
	 * Loads the ZIP archive specified by the url property.
	 * Returns a Promise that resolves when the ZIP archive has been loaded and extracted.
	 *
	 * @async
	 * @returns {Promise<Files>} A Promise that resolves when the ZIP archive has been loaded and extracted.
	 */
	async load() {

		this.clear();

		const startTime = Date.now();
		const res = await fetch( this.url, this.fetchOptions ).then( ( res ) => {

			const that = this;
			const total = parseInt( res.headers.get( 'content-length' ), 10 );
			let loaded = 0;

			return new Response( new ReadableStream( {
				start( controller ) {
					const reader = res.body.getReader();

					const pump = async () => {
						const { done, value } = await reader.read();
						if ( done ) {

							controller.close();
							return;

						}
						loaded += value.byteLength;
						controller.enqueue( value );
						that.dispatch( {
							type: 'progress',
							loaded,
							total,
							elapsedTime: Date.now() - startTime,
						} );
						pump();
					};
					pump();
				}
			} ) );

		} ).catch( ( error ) => {

			this.dispatch( {
				type: 'error',
				error
			} );

		} );

		const arrayBuffer = await res.arrayBuffer();
		this.files = parseZip( arrayBuffer );
		this.dispatch( {
			type: 'load',
			elapsedTime: Date.now() - startTime,
		} );

		return this.files;

	}

	/**
	 * Extracts a file from the loaded ZIP archive and returns it as a Blob URL.
	 *
	 * @param {string} filename - The name of the file to extract.
	 * @param {string} type - The MIME type of the file.
	 * @returns {string} The Blob URL of the extracted file.
	 */
	extractAsBlobUrl( filename, type ) {

		if ( this.files[ filename ].url ) {

			return this.files[ filename ].url;

		}

		const blob = new Blob( [ this.files[ filename ].buffer ], { type: type } );
		this.files[ filename ].url = URL.createObjectURL( blob );
		return this.files[ filename ].url;

	}

	/**
	 * @param {string} filename
	 * @returns {string|undefined}
	 */
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

	/**
	 * @param {string} filename
	 * @returns {*}
	 */
	extractAsJSON( filename ) {

		return JSON.parse( this.extractAsText( filename ) );

	}

	/**
	 * Adds the specified event listener.
	 * @param {string} type event name
	 * @param {import('./types.ts').Listener} listener handler function
	 */
	on( type, listener ) {

		if ( ! this._listeners[ type ] ) {

			this._listeners[ type ] = [];

		}

		if ( this._listeners[ type ].indexOf( listener ) === - 1 ) {

			this._listeners[ type ].push( listener );

		}

	}

	/**
	 * Removes the specified event listener
	 * @param {string} type event name
	 * @param {import('./types.ts').Listener} listener handler function
	 */
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

	/** @param {string=} filename */
	clear( filename ) {

		if ( !! filename ) {

			URL.revokeObjectURL( this.files[ filename ].url );
			delete this.files[ filename ];
			return;

		}

		for ( let key in this.files ) {

			URL.revokeObjectURL( this.files[ key ].url );

		}

		this.files = null;

	}

};

export default ZipLoader;
