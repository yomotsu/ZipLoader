const LITTLE_ENDIAN = true;

export class DataReader {

	/** @param {ArrayBuffer} buffer */
	constructor( buffer ) {

		this.dataView = new DataView( buffer );
		this.position = 0;

	}

	/** @param {number} length */
	skip( length ) {

		this.position += length;

	}

	/** @param {number} length */
	readBytes( length ) {

		const type = length === 4 ? 'getUint32' :
		             length === 2 ? 'getUint16' :
		                            'getUint8';
		const start = this.position;
		this.position += length;
		return this.dataView[ type ]( start, LITTLE_ENDIAN );

	}

}
