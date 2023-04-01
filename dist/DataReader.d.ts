export class DataReader {
    /** @param {ArrayBuffer} buffer */
    constructor(buffer: ArrayBuffer);
    dataView: DataView;
    position: number;
    /** @param {number} length */
    skip(length: number): void;
    /** @param {number} length */
    readBytes(length: number): number;
}
