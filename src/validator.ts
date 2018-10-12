import { ExceptUndefined, Primitive } from "./contracts/types-helpers";

export type DefaultValue<TValue = any> = TValue | (() => TValue);

// tslint:disable-next-line:typedef
export function Validate<TDefaultValue = undefined>(value: unknown, defaultValue?: DefaultValue<TDefaultValue>) {
    return {
        isBoolean: isBoolean<TDefaultValue>(value, defaultValue),
        isString: isString<TDefaultValue>(value, defaultValue),
        isNumber: isNumber<TDefaultValue>(value, defaultValue),
        isNetworkPort: isNetworkPort<TDefaultValue>(value, defaultValue),
        isPrimitiveArray: isPrimitiveArray<TDefaultValue>(value, defaultValue)
    };
}

function getDefaultValue<TValue = unknown>(defaultValue: DefaultValue<any> | undefined, fallbackValue: TValue): TValue {
    if (defaultValue !== undefined) {
        if (typeof defaultValue === "function") {
            const callback = defaultValue as () => TValue;
            return callback();
        } else {
            return defaultValue;
        }
    }

    return fallbackValue;
}

//#region Validators

function isBoolean<TDefaultValue>(
    value: unknown,
    defaultValue?: DefaultValue<TDefaultValue>
): () => boolean | ExceptUndefined<TDefaultValue> {
    return () => {
        if (typeof value === "boolean") {
            return value;
        }

        return getDefaultValue<boolean>(defaultValue, false);
    };
}

function isString<TDefaultValue>(
    value: unknown,
    defaultValue?: DefaultValue<TDefaultValue>
): (canBeEmpty?: boolean) => string | ExceptUndefined<TDefaultValue> {
    const FALLBACK_VALUE: string = "";

    return (canBeEmpty: boolean = true) => {
        if (typeof value === "string") {
            if (!canBeEmpty && value === "") {
                return getDefaultValue<string>(defaultValue, FALLBACK_VALUE);
            }

            return value;
        }

        return getDefaultValue<string>(defaultValue, FALLBACK_VALUE);
    };
}

function isNumber<TDefaultValue>(
    value: unknown,
    defaultValue?: DefaultValue<TDefaultValue>
): (min?: number, max?: number) => number | ExceptUndefined<TDefaultValue> {
    const FALLBACK_VALUE: number = 0;

    return (min?: number, max?: number) => {
        if (typeof value === "number") {
            if ((min != null && value < min) || (max != null && value > max) || isNaN(value)) {
                return getDefaultValue<number>(defaultValue, FALLBACK_VALUE);
            }

            return value;
        }

        return getDefaultValue<number>(defaultValue, FALLBACK_VALUE);
    };
}

function isNetworkPort<TDefaultValue>(
    value: unknown,
    defaultValue?: DefaultValue<TDefaultValue>
): () => number | ExceptUndefined<TDefaultValue> {
    const FALLBACK_VALUE: number = 0;

    return () => {
        if (typeof value === "number") {
            if (value < 0 || value > 65535 || isNaN(value)) {
                return getDefaultValue<number>(defaultValue, FALLBACK_VALUE);
            }

            return value;
        }

        return getDefaultValue<number>(defaultValue, FALLBACK_VALUE);
    };
}

function isPrimitiveArray<TDefaultValue>(
    value: unknown,
    defaultValue?: DefaultValue<TDefaultValue>
): () => Primitive[] | ExceptUndefined<TDefaultValue> {
    const FALLBACK_VALUE: Primitive[] = [];

    return () => {
        if (Array.isArray(value)) {
            return value;
        }

        return getDefaultValue<Primitive[]>(defaultValue, FALLBACK_VALUE);
    };
}

//#endregion
