import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import {
    Primitive,
    DeepPartial,
    ExcludePrimitiveAndPrimitiveArrayProperties,
    PrimitiveAndPrimitiveArrayKeys,
    ExcludePrimitiveAndPrimitiveArrayKeys,
    PrimitiveAndPrimitiveArrayProperties
} from "../contracts/types-helpers";

export interface SettingsScopeEvents {
    updated: (key: string[], value: Primitive | Primitive[]) => void;
    error: Error;
}

export type ScopedSettings<TValue> = {
    [T in keyof ExcludePrimitiveAndPrimitiveArrayProperties<TValue>]: SettingsScopeBase<
        ExcludePrimitiveAndPrimitiveArrayProperties<TValue>[T]
    >
};
export type DefaultSettings<TSettings> = PrimitiveAndPrimitiveArrayProperties<TSettings>;

const SettingsScopeEmitter: { new (): StrictEventEmitter<EventEmitter, SettingsScopeEvents> } = EventEmitter;

export abstract class SettingsScopeBase<TSettings> extends SettingsScopeEmitter {
    constructor(settings: DeepPartial<TSettings>) {
        super();

        this.settings = {
            ...(this.getDefaultSettings() as {}),
            ...(settings as {})
        } as TSettings;

        this.scopes = this.initScopedSettings();
    }

    protected readonly settings: TSettings;
    protected readonly scopes: ScopedSettings<TSettings>;

    public get<TKey extends PrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey): TSettings[TKey] {
        return this.settings[key];
    }

    public getScope<TKey extends ExcludePrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey): SettingsScopeBase<TSettings[TKey]> {
        return this.scopes[key];
    }

    public getScopes(): ScopedSettings<TSettings> {
        return this.scopes;
    }

    public getAll(): TSettings {
        const currentSettings: { [key: string]: unknown } = this.settings as {};

        for (const scopeKey of Object.keys(this.scopes)) {
            currentSettings[scopeKey] = this.scopes[scopeKey].getAll();
        }

        return currentSettings as TSettings;
    }

    public update<TKey extends PrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey, value: TSettings[TKey]): void {
        this.settings[key] = value;
        this.emit("updated", [key as string], (value as any) as Primitive);
    }

    protected abstract initScopedSettings(): ScopedSettings<TSettings>;
    protected abstract getDefaultSettings(): DefaultSettings<TSettings>;
}
