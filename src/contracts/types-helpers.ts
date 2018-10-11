export type Primitive = string | number | boolean | null | undefined;

export type KeysExtend<T, TExtends> = { [K in keyof T]: T[K] extends TExtends ? K : never }[keyof T];
export type PropertiesExtend<T, TExtends> = Pick<T, KeysExtend<T, TExtends>>;

export type PrimitiveKeys<T> = KeysExtend<T, Primitive>;
export type PrimitiveProperties<T> = PropertiesExtend<T, Primitive>;

export type ExcludeKeysExtend<T, TExtends> = { [K in keyof T]: T[K] extends TExtends ? never : K }[keyof T];
export type ExcludePropertiesExtend<T, TExtends> = Pick<T, ExcludeKeysExtend<T, TExtends>>;

export type ExcludePrimitiveKeys<T> = ExcludeKeysExtend<T, Primitive>;
export type ExcludePrimitiveProperties<T> = ExcludePropertiesExtend<T, Primitive>;

export type PrimitiveAndPrimitiveArrayKeys<T> = KeysExtend<T, Primitive | Primitive[]>;
export type PrimitiveAndPrimitiveArrayProperties<T> = PropertiesExtend<T, Primitive | Primitive[]>;

export type ExcludePrimitiveAndPrimitiveArrayKeys<T> = ExcludeKeysExtend<T, Primitive | Primitive[]>;
export type ExcludePrimitiveAndPrimitiveArrayProperties<T> = ExcludePropertiesExtend<T, Primitive | Primitive[]>;

export type DeepPartial<T> = { [K in keyof T]?: Partial<T[K]> };
export type ExceptUndefined<T> = T extends undefined ? never : T;
