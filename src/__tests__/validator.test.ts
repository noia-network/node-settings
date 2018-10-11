import { Validate } from "../validator";

it("string validation", () => {
    const defaultValue = "DEFAULT_VALUE";
    const result: string = Validate(false, defaultValue).isString();

    expect(result).toBe(defaultValue);
});

it("boolean validation", () => {
    const result: boolean = Validate("").isBoolean();

    expect(result).toBe(false);
});

it("number validation", () => {
    const result: number = Validate("").isNumber();

    expect(result).toBe(0);
});

it("number validation NaN", () => {
    const result: number = Validate(NaN).isNumber();

    expect(result).toBe(0);
});

it("number validation Range correct", () => {
    const result: number = Validate(1000).isNumber(0, 56666);

    expect(result).toBe(1000);
});

it("number validation Range incorrect", () => {
    const defaultPort = 7676;
    const result: number = Validate(700000, defaultPort).isNumber(0, 65535);

    expect(result).toBe(defaultPort);
});
