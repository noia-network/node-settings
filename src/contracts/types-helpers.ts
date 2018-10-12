export type Primitive = string | number | boolean | null | undefined;

export type KeysExtend<TT, TExtends> = { [TKey in keyof TT]: TT[TKey] extends TExtends ? TKey : never }[keyof TT];
export type PropertiesExtend<TT, TExtends> = Pick<TT, KeysExtend<TT, TExtends>>;

export type PrimitiveKeys<TT> = KeysExtend<TT, Primitive>;
export type PrimitiveProperties<TT> = PropertiesExtend<TT, Primitive>;

export type ExcludeKeysExtend<TT, TExtends> = { [TKey in keyof TT]: TT[TKey] extends TExtends ? never : TKey }[keyof TT];
export type ExcludePropertiesExtend<TT, TExtends> = Pick<TT, ExcludeKeysExtend<TT, TExtends>>;

export type ExcludePrimitiveKeys<TT> = ExcludeKeysExtend<TT, Primitive>;
export type ExcludePrimitiveProperties<TT> = ExcludePropertiesExtend<TT, Primitive>;

export type PrimitiveAndPrimitiveArrayKeys<TT> = KeysExtend<TT, Primitive | Primitive[]>;
export type PrimitiveAndPrimitiveArrayProperties<TT> = PropertiesExtend<TT, Primitive | Primitive[]>;

export type ExcludePrimitiveAndPrimitiveArrayKeys<TT> = ExcludeKeysExtend<TT, Primitive | Primitive[]>;
export type ExcludePrimitiveAndPrimitiveArrayProperties<TT> = ExcludePropertiesExtend<TT, Primitive | Primitive[]>;

export type DeepPartial<TT> = { [TKey in keyof TT]?: Partial<TT[TKey]> };
export type ExceptUndefined<TT> = TT extends undefined ? never : TT;
