export class ImmutableMap<K, V> implements ReadonlyMap<K, V> {
	private readonly __map: ReadonlyMap<K, V>;

	private constructor(map?: ReadonlyMap<K, V>) {
		this.__map = map ?? new Map();
	}

	public static empty<K, V>(): ImmutableMap<K, V> {
		return new ImmutableMap();
	}

	public clear(): ImmutableMap<K, V> {
		return new ImmutableMap();
	}

	public delete(key: K): ImmutableMap<K, V> {
		const map = new Map(this.__map);
		map.delete(key);
		return new ImmutableMap(map);
	}
	public set(key: K, value: V): ImmutableMap<K, V> {
		const map = new Map(this.__map);
		map.set(key, value);
		return new ImmutableMap(map);
	}

	//#region ReadonlyMap
	public forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void {
		return this.__map.forEach(callbackfn, thisArg);
	}
	public get(key: K): V | undefined {
		return this.__map.get(key);
	}
	public has(key: K): boolean {
		return this.__map.has(key);
	}
	public get size(): number {
		return this.__map.size;
	}
	public entries(): IterableIterator<[K, V]> {
		return this.__map.entries();
	}
	public keys(): IterableIterator<K> {
		return this.__map.keys();
	}
	public values(): IterableIterator<V> {
		return this.__map.values();
	}
	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this.__map[Symbol.iterator]();
	}
	//#endregion ReadonlyMap
}
