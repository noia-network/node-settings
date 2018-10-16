import { ExceptUndefined, Primitive } from "./contracts/types-helpers";

// tslint:disable-next-line:no-any
export type DefaultValue<TValue = any> = TValue | (() => TValue);

// tslint:disable-next-line:typedef
export function Validate<TDefaultValue = undefined>(value: unknown, defaultValue?: DefaultValue<TDefaultValue>) {
    return {
        isBoolean: isBoolean<TDefaultValue>(value, defaultValue),
        isString: isString<TDefaultValue>(value, defaultValue),
        isNumber: isNumber<TDefaultValue>(value, defaultValue),
        isNetworkPort: isNetworkPort<TDefaultValue>(value, defaultValue),
        isIpv4: isIpv4<TDefaultValue>(value, defaultValue),
        isPrimitiveArray: isPrimitiveArray<TDefaultValue>(value, defaultValue)
    };
}

// tslint:disable-next-line:no-any
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
    value = Number(value);
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
    const resolvedDefaultValue = getDefaultValue<number>(defaultValue, FALLBACK_VALUE);

    const resolvedValue = Number(value);

    return () => {
        if (isNaN(resolvedValue) || resolvedValue < 0 || resolvedValue > 65535) {
            return resolvedDefaultValue;
        }

        return resolvedValue;
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

function isIpv4<TDefaultValue>(value: unknown, defaultValue?: DefaultValue<TDefaultValue>): () => string | ExceptUndefined<TDefaultValue> {
    const FALLBACK_VALUE: Primitive = "0.0.0.0";
    const resolvedDefaultValue = getDefaultValue<string>(defaultValue, FALLBACK_VALUE);

    return () => {
        if (typeof value !== "string") {
            return resolvedDefaultValue;
        }

        const result = value.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
        if (result == null || result.length === 0) {
            return resolvedDefaultValue;
        }

        return result[0];
    };
}

//#endregion
