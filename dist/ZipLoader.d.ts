export default ZipLoader;
/**
 * @class ZipLoader
 * @classdesc A class for loading and extracting files from a ZIP archive.
 */
declare const ZipLoader: {
    new (url: string): {
        /** @private */
        _listeners: {};
        /** @type {String|undefined} */
        url: string | undefined;
        /** @type {import('./types.ts').Files | null} */
        files: import('./types.ts').Files | null;
        /**
         * Loads the ZIP archive specified by the url property.
         * Returns a Promise that resolves when the ZIP archive has been loaded and extracted.
         *
         * @async
         * @returns {Promise<Files>} A Promise that resolves when the ZIP archive has been loaded and extracted.
         */
        load(): Promise<Files>;
        /**
         * Extracts a file from the loaded ZIP archive and returns it as a Blob URL.
         *
         * @param {string} filename - The name of the file to extract.
         * @param {string} type - The MIME type of the file.
         * @returns {string} The Blob URL of the extracted file.
         */
        extractAsBlobUrl(filename: string, type: string): string;
        /**
         * @param {string} filename
         * @returns {string|undefined}
         */
        extractAsText(filename: string): string | undefined;
        /**
         * @param {string} filename
         * @returns {*}
         */
        extractAsJSON(filename: string): any;
        /**
         * Adds the specified event listener.
         * @param {string} type event name
         * @param {import('./types.ts').Listener} listener handler function
         */
        on(type: string, listener: import('./types.ts').Listener): void;
        /**
         * Removes the specified event listener
         * @param {string} type event name
         * @param {import('./types.ts').Listener} listener handler function
         */
        off(type: string, listener: import('./types.ts').Listener): void;
        dispatch(event: any): void;
        /** @param {string=} filename */
        clear(filename?: string | undefined): void;
    };
    /**
   * @function
   * @description Loads a zip archive from a File or Blob object and returns a Promise that resolves with a new ZipLoader instance
   * @param {Blob|File} blobOrFile - The Blob or File object to load
   * @returns {Promise<ZipLoader>}
   */
    unzip(blobOrFile: Blob | File): Promise<{
        /** @private */
        _listeners: {};
        /** @type {String|undefined} */
        url: string | undefined;
        /** @type {import('./types.ts').Files | null} */
        files: import('./types.ts').Files | null;
        /**
         * Loads the ZIP archive specified by the url property.
         * Returns a Promise that resolves when the ZIP archive has been loaded and extracted.
         *
         * @async
         * @returns {Promise<Files>} A Promise that resolves when the ZIP archive has been loaded and extracted.
         */
        load(): Promise<Files>;
        /**
         * Extracts a file from the loaded ZIP archive and returns it as a Blob URL.
         *
         * @param {string} filename - The name of the file to extract.
         * @param {string} type - The MIME type of the file.
         * @returns {string} The Blob URL of the extracted file.
         */
        extractAsBlobUrl(filename: string, type: string): string;
        /**
         * @param {string} filename
         * @returns {string|undefined}
         */
        extractAsText(filename: string): string | undefined;
        /**
         * @param {string} filename
         * @returns {*}
         */
        extractAsJSON(filename: string): any;
        /**
         * Adds the specified event listener.
         * @param {string} type event name
         * @param {import('./types.ts').Listener} listener handler function
         */
        on(type: string, listener: import('./types.ts').Listener): void;
        /**
         * Removes the specified event listener
         * @param {string} type event name
         * @param {import('./types.ts').Listener} listener handler function
         */
        off(type: string, listener: import('./types.ts').Listener): void;
        dispatch(event: any): void;
        /** @param {string=} filename */
        clear(filename?: string | undefined): void;
    }>;
};
