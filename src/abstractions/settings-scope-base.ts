import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import {
    DeepPartial,
    ExcludePrimitiveAndPrimitiveArrayProperties,
    PrimitiveAndPrimitiveArrayKeys,
    ExcludePrimitiveAndPrimitiveArrayKeys,
    PrimitiveAndPrimitiveArrayProperties,
    Primitive
} from "../contracts/types-helpers";
import { Helpers } from "../helpers";

export interface UpdatedEvent {
    scope: string;
    scopesPath: string[];
    fieldIds: string[];
}

export interface SettingsScopeEvents {
    updated: (event: UpdatedEvent) => void;
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
    constructor(protected readonly scope: string, settings: DeepPartial<TSettings>) {
        super();

        this.settings = {
            ...(this.getDefaultSettings() as {}),
            ...(settings as {})
        } as TSettings;

        this.scopes = this.initScopedSettings();
        // Re-emit to higher levels.
        for (const scopeKey of Object.keys(this.scopes)) {
            this.scopes[scopeKey].on("updated", event => {
                const propagatedEvent: UpdatedEvent = {
                    ...event,
                    scopesPath: [this.scope, ...event.scopesPath]
                };

                this.emit("updated", propagatedEvent);
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

    public getAllScopes(): ScopedSettings<TSettings> {
        return this.scopes;
    }

    /**
     * Gets whole settings object.
     */
    public dehydrate(): TSettings {
        const currentSettings: { [key: string]: unknown } = this.settings as {};

        for (const scopeKey of Object.keys(this.scopes)) {
            currentSettings[scopeKey] = this.scopes[scopeKey].dehydrate();
        }

        return currentSettings as TSettings;
    }

    public set<TKey extends PrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey, value: TSettings[TKey]): void {
        if (this.settings[key] === value) {
            return;
        }

        this.settings[key] = value;
        const event: UpdatedEvent = {
            scope: this.scope,
            fieldIds: [key as string],
            scopesPath: [this.scope]
        };

        this.emit("updated", event);
    }

    public hydrate(nextSettings: Partial<TSettings> = {}): void {
        const prevSettings: { [key: string]: unknown } = this.settings;
        const settings: { [key: string]: unknown } = {
            ...(this.getDefaultSettings() as {}),
            ...(nextSettings as {})
        } as TSettings;
        // We need to emit an "updated" event, what actually changed after hydration.
        const changedKeys: string[] = [];

        for (const key of Object.keys(nextSettings)) {
            const prevValue: unknown = prevSettings[key];
            const value: unknown = settings[key];

            if (Helpers.isPrimitiveOrArrayOfPrimitives(value)) {
                if (
                    prevValue !== value ||
                    (Array.isArray(value) &&
                        Helpers.isPrimitiveOrArrayOfPrimitives(value) &&
                        !Helpers.primitiveArraysAreEqual(value, prevValue as Primitive[]))
                ) {
                    changedKeys.push(key);
                }
            } else {
                if (this.scopes[key] != null) {
                    this.scopes[key].hydrate(value as {});
                }
            }
        }

        this.settings = settings as TSettings;
        const event: UpdatedEvent = {
            scope: this.scope,
            fieldIds: changedKeys,
            scopesPath: [this.scope]
        };
        this.emit("updated", event);
    }

    protected abstract initScopedSettings(): ScopedSettings<TSettings>;
    public abstract getDefaultSettings(): DefaultSettings<TSettings>;
}
