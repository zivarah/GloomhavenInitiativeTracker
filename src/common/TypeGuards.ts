export function isDefined<T>(value: T | undefined): value is T {
	return typeof value !== "undefined";
}

export function isNumber(value: unknown): value is number {
	return typeof value === "number";
}

export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}
