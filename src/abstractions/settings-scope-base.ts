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
import { Helpers } from "../helpers";

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
        // Re-emit to higher levels.
        for (const scopeKey of Object.keys(this.scopes)) {
            this.scopes[scopeKey].on("updated", (keys, value) => {
                this.emit("updated", [scopeKey, ...keys], value);
            });

            this.scopes[scopeKey].on("error", error => {
                this.emit("error", error);
            });
        }
    }

    protected settings: TSettings;
    protected scopes: ScopedSettings<TSettings>;

    public get<TKey extends PrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey): TSettings[TKey] {
        return this.settings[key];
    }

    public getScope<TKey extends ExcludePrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey): SettingsScopeBase<TSettings[TKey]> {
        return this.scopes[key];
    }

    public getScopes(): ScopedSettings<TSettings> {
        return this.scopes;
    }

    public getSettings(): TSettings {
        const currentSettings: { [key: string]: unknown } = this.settings as {};

        for (const scopeKey of Object.keys(this.scopes)) {
            currentSettings[scopeKey] = this.scopes[scopeKey].getSettings();
        }

        return currentSettings as TSettings;
    }

    public set<TKey extends PrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey, value: TSettings[TKey]): void {
        if (this.settings[key] === value) {
            return;
        }

        this.settings[key] = value;
        this.emit("updated", [key as string], (value as any) as Primitive);
    }

    public hydrate(nextSettings: Partial<TSettings> = {}): void {
        const settings = {
            ...(this.getDefaultSettings() as {}),
            ...(nextSettings as {})
        } as TSettings;

        for (const key of Object.keys(nextSettings)) {
            const value: unknown = (nextSettings as { [key: string]: unknown })[key];

            if (!Helpers.isPrimitiveOrArrayOfPrimitives(value) && this.scopes[key] != null) {
                this.scopes[key].hydrate(value as {});
            }
        }

        this.settings = settings;
    }

    protected abstract initScopedSettings(): ScopedSettings<TSettings>;
    public abstract getDefaultSettings(): DefaultSettings<TSettings>;
}
