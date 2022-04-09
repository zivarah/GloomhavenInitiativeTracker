export function getEnumKeys<TEnum extends object>(enumObj: TEnum): (keyof TEnum)[] {
	return Object.keys(enumObj).filter(key => isNaN(parseInt(key, 10))) as (keyof TEnum)[];
}

export function getEnumValues<TEnum extends object>(enumObj: TEnum): TEnum[keyof TEnum][] {
	return getEnumKeys(enumObj).map(key => enumObj[key]);
}

export function parseNumericEnum<TEnum extends object>(enumObj: TEnum, value: string | undefined): TEnum[keyof TEnum] | undefined {
	if (!value) {
		return undefined;
	}
	const parsed = parseInt(value, 10);
	if (isNaN(parsed)) {
		return;
	}
	if (parsed in enumObj) {
		return parsed as unknown as TEnum[keyof TEnum];
	}
	return undefined;
}
