export function getEnumKeys<TEnum extends object>(enumObj: TEnum): (keyof TEnum)[] {
	return Object.keys(enumObj).filter(key => isNaN(parseInt(key, 10))) as (keyof TEnum)[];
}

export function getEnumValues<TEnum extends object>(enumObj: TEnum): TEnum[keyof TEnum][] {
	return getEnumKeys(enumObj).map(key => enumObj[key]);
}
