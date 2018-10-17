export type Primitive = string | number | boolean | null | undefined;

export type KeysExtend<TType, TExtends> = { [TKey in keyof TType]: TType[TKey] extends TExtends ? TKey : never }[keyof TType];
export type PropertiesExtend<TType, TExtends> = Pick<TType, KeysExtend<TType, TExtends>>;

export type PrimitiveKeys<TType> = KeysExtend<TType, Primitive>;
export type PrimitiveProperties<TType> = PropertiesExtend<TType, Primitive>;

export type ExcludeKeysExtend<TType, TExtends> = { [TKey in keyof TType]: TType[TKey] extends TExtends ? never : TKey }[keyof TType];
export type ExcludePropertiesExtend<TType, TExtends> = Pick<TType, ExcludeKeysExtend<TType, TExtends>>;

export type ExcludePrimitiveKeys<TType> = ExcludeKeysExtend<TType, Primitive>;
export type ExcludePrimitiveProperties<TType> = ExcludePropertiesExtend<TType, Primitive>;

export type PrimitiveAndPrimitiveArrayKeys<TType> = KeysExtend<TType, Primitive | Primitive[]>;
export type PrimitiveAndPrimitiveArrayProperties<TType> = PropertiesExtend<TType, Primitive | Primitive[]>;

export type ExcludePrimitiveAndPrimitiveArrayKeys<TType> = ExcludeKeysExtend<TType, Primitive | Primitive[]>;
export type ExcludePrimitiveAndPrimitiveArrayProperties<TType> = ExcludePropertiesExtend<TType, Primitive | Primitive[]>;

export declare type DeepPartial<TType> = { [TKey in keyof TType]?: DeepPartial<TType[TKey]> };
export type ExceptUndefined<TType> = TType extends undefined ? never : TType;
