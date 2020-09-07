export interface IPubSub {
	publish: (name: string, options: object) => void;
	asyncIterator: (names: string | [string]) => void;
}
