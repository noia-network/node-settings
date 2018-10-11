export type DefaultValue<TValue = any> = TValue | (() => TValue);

// tslint:disable-next-line:typedef
export function Validate(value: unknown, defaultValue?: DefaultValue) {
    return {
        isBoolean: isBoolean(value, defaultValue),
        isString: isString(value, defaultValue),
        isNumber: isNumber(value, defaultValue)
    };
}

function getDefaultValue<TValue = unknown>(defaultValue: DefaultValue<TValue> | undefined, fallbackValue: TValue): TValue {
    if (defaultValue != null) {
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

function isBoolean(value: unknown, defaultValue?: DefaultValue): () => boolean {
    return () => {
        if (typeof value === "boolean") {
            return value;
        }

        return getDefaultValue<boolean>(defaultValue, false);
    };
}

function isString(value: unknown, defaultValue?: DefaultValue): (canBeEmpty?: boolean) => string {
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

function isNumber(value: unknown, defaultValue?: DefaultValue): (min?: number, max?: number) => number {
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

//#endregion
