export type Primitive = string | number | boolean | null | undefined;

export type OnlyPrimitiveKeys<T> = { [K in keyof T]: T[K] extends Primitive ? K : never }[keyof T];
export type OnlyPrimitivesProperties<T> = Pick<T, OnlyPrimitiveKeys<T>>;
export type ExceptPrimitiveKeys<T> = { [K in keyof T]: T[K] extends Primitive ? never : K }[keyof T];
export type ExceptPrimitivesProperties<T> = Pick<T, ExceptPrimitiveKeys<T>>;
