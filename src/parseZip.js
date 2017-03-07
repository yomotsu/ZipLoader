// https://nodeca.github.io/pako/#Inflate
import pako from 'pako/lib/inflate.js';
import DataReader from './DataReader.js';

const LOCAL_FILE_HEADER = 0x04034b50;
const CENTRAL_DIRECTORY = 0x02014b50;
// const END_OF_CENTRAL_DIRECTORY = 0x06054b50;

const parseZip = ( buffer ) => {

	const reader = new DataReader( buffer );
	const files = {};

	while ( true ) {

		const signature = reader.readBytes( 4 );

		if ( signature === LOCAL_FILE_HEADER ) {

			const file = parseLocalFile( reader );
			files[ file.name ] = { data: file.data };
			continue;

		}

		if ( signature === CENTRAL_DIRECTORY ) {

			parseCentralDirectory( reader );
			continue

		}

		break;

	}

	return files;

}

// # Local file header
// 
// | Offset |  Length  | Contents                                 |
// | ------ | -------- | ---------------------------------------- |
// |   0    |  4 bytes | Local file header signature (0x04034b50) |
// |   4    |  2 bytes | Version needed to extract                |
// |   6    |  2 bytes | General purpose bit flag                 |
// |   8    |  2 bytes | Compression method                       |
// |  10    |  2 bytes | Last mod file time                       |
// |  12    |  2 bytes | Last mod file date                       |
// |  14    |  4 bytes | CRC-32                                   |
// |  18    |  4 bytes | Compressed size (n)                      |
// |  22    |  4 bytes | Uncompressed size                        |
// |  26    |  2 bytes | Filename length (f)                      |
// |  28    |  2 bytes | Extra field length (e)                   |
// |        | (f)bytes | Filename                                 |
// |        | (e)bytes | Extra field                              |
// |        | (n)bytes | Compressed data                          |
const parseLocalFile = ( reader ) => {

	let i = 0;
	let data;
	reader.skip( 4 );
	// const version          = reader.readBytes( 2 );
	// const bitFlag          = reader.readBytes( 2 );
	const compression      = reader.readBytes( 2 );
	reader.skip( 8 );
	// const lastModTime      = reader.readBytes( 2 );
	// const lastModDate      = reader.readBytes( 2 );
	// const crc32            = reader.readBytes( 4 );
	const compressedSize   = reader.readBytes( 4 );
	reader.skip( 4 );
	// const uncompressedSize = reader.readBytes( 4 );
	const filenameLength   = reader.readBytes( 2 );
	const extraFieldLength = reader.readBytes( 2 );
	const filename       = [];
	// const extraField     = [];
	const compressedData = new Uint8Array( compressedSize );

	for ( i = 0; i < filenameLength; i ++ ) {

		filename.push( String.fromCharCode( reader.readBytes( 1 ) ) );

	}

	reader.skip( extraFieldLength );
	// for ( i = 0; i < extraFieldLength; i ++ ) {

	// 	extraField.push( reader.readBytes( 1 ) );

	// }

	for ( i = 0; i < compressedSize; i ++ ) {

		compressedData[ i ] = reader.readBytes( 1 );

	}

	switch ( compression ) {

		case 0:
			data = compressedData;
			break;
		case 8:
			data = new Uint8Array( pako.inflate( compressedData, { raw: true } ) );
			break; 
		default:
			console.log( `${ filename.join( '' ) }: unsupported compression type` );
			data = compressedData;

	}

	return {
		name: filename.join( '' ),
		data: data
	};

}

// # Central directory
//
// | Offset |  Length  | Contents                                   |
// | ------ | -------- | ------------------------------------------ |
// |   0    |  4 bytes | Central file header signature (0x02014b50) |
// |   4    |  2 bytes | Version made by                            |
// |   6    |  2 bytes | Version needed to extract                  |
// |   8    |  2 bytes | General purpose bit flag                   |
// |  10    |  2 bytes | Compression method                         |
// |  12    |  2 bytes | Last mod file time                         |
// |  14    |  2 bytes | Last mod file date                         |
// |  16    |  4 bytes | CRC-32                                     |
// |  20    |  4 bytes | Compressed size                            |
// |  24    |  4 bytes | Uncompressed size                          |
// |  28    |  2 bytes | Filename length (f)                        |
// |  30    |  2 bytes | Extra field length (e)                     |
// |  32    |  2 bytes | File comment length (c)                    |
// |  34    |  2 bytes | Disk number start                          |
// |  36    |  2 bytes | Internal file attributes                   |
// |  38    |  4 bytes | External file attributes                   |
// |  42    |  4 bytes | Relative offset of local header            |
// |  46    | (f)bytes | Filename                                   |
// |        | (e)bytes | Extra field                                |
// |        | (c)bytes | File comment                               |
const parseCentralDirectory = ( reader ) => {

	let i = 0;
	reader.skip( 24 );
	// const versionMadeby        = reader.readBytes( 2 );
	// const versionNeedToExtract = reader.readBytes( 2 );
	// const bitFlag              = reader.readBytes( 2 );
	// const compression          = reader.readBytes( 2 );
	// const lastModTime          = reader.readBytes( 2 );
	// const lastModDate          = reader.readBytes( 2 );
	// const crc32                = reader.readBytes( 4 );
	// const compressedSize       = reader.readBytes( 4 );
	// const uncompressedSize     = reader.readBytes( 4 );
	const filenameLength       = reader.readBytes( 2 );
	const extraFieldLength     = reader.readBytes( 2 );
	const fileCommentLength    = reader.readBytes( 2 );
	reader.skip( 12 );
	// const diskNumberStart      = reader.readBytes( 2 );
	// const internalFileAttrs    = reader.readBytes( 2 );
	// const externalFileAttrs    = reader.readBytes( 4 );
	// const relativeOffset       = reader.readBytes( 4 );
	// const filename    = [];
	// const extraField  = [];
	// const fileComment = [];

	reader.skip( filenameLength );
	// for ( i = 0; i < filenameLength; i ++ ) {

	// 	filename.push( String.fromCharCode( reader.readBytes( 1 ) ) );

	// }

	reader.skip( extraFieldLength );
	// for ( i = 0; i < extraFieldLength; i ++ ) {

	// 	extraField.push( reader.readBytes( 1 ) );

	// }

	reader.skip( fileCommentLength );
	// for ( i = 0; i < fileCommentLength; i ++ ) {

	// 	fileComment.push( reader.readBytes( 1 ) );

	// }

}

export default parseZip
