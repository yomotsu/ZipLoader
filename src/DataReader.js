
const LITTLE_ENDIAN = true;

export default class {

	constructor( buffer ) {

		this.dataView = new DataView( buffer );
		this.position = 0;

	}

	skip( length ) {

		this.position += length;

	}

	readBytes( length ) {

		const type = length === 4 ? 'getUint32' :
		             length === 2 ? 'getUint16' :
		                            'getUint8';
		const start = this.position;
		this.position += length;
		return this.dataView[ type ]( start, LITTLE_ENDIAN );

	}

}
