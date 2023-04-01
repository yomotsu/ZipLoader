export type Listener = ( event?: DispatcherEvent ) => void;

export interface DispatcherEvent {
	type: string;
	[ key: string ]: any;
}

export type Files = {
	[ fineName: string ]: {
		buffer: Uint8Array;
		url?: string;
	};
};
