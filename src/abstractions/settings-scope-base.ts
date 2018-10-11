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
import { UpdatedEvent, HydratedEvent, Identifier } from "../contracts/settings-events";
import { Helpers } from "../helpers";
import { IdentifierHelpers } from "../identifier-helpers";

interface SettingsScopeEvents {
    updated: (event: UpdatedEvent) => void;
    hydrated: (event: HydratedEvent) => void;
    error: Error;
}

export type ScopedSettings<TValue> = {
    [T in keyof ExcludePrimitiveAndPrimitiveArrayProperties<TValue>]: SettingsScopeBase<
        ExcludePrimitiveAndPrimitiveArrayProperties<TValue>[T]
    >
};
export type ScopeSettings<TSettings> = PrimitiveAndPrimitiveArrayProperties<TSettings>;

const SettingsScopeEmitter: { new (): StrictEventEmitter<EventEmitter, SettingsScopeEvents> } = EventEmitter;

export abstract class SettingsScopeBase<TSettings extends {}> extends SettingsScopeEmitter {
    constructor(scopeKey: string, settings: DeepPartial<TSettings>) {
        super();

        this.scope = {
            key: scopeKey,
            absoluteKey: scopeKey
        };

        this.settings = this.calculateSettings(settings);

        this.scopes = this.initScopedSettings();
        // Re-emit to higher levels.
        for (const scopeKey of Object.keys(this.scopes)) {
            this.scopes[scopeKey].on("updated", event => {
                const propagatedEvent: UpdatedEvent = {
                    ...event,
                    scope: IdentifierHelpers.addScope(event.scope, this.scope),
                    setting: IdentifierHelpers.addScope(event.setting, this.scope)
                };

                this.emit("updated", propagatedEvent);
            });

            this.scopes[scopeKey].on("hydrated", event => {
                const propagatedEvent: HydratedEvent = {
                    scope: IdentifierHelpers.addScope(event.scope, this.scope)
                };

                this.emit("hydrated", propagatedEvent);
            });

            this.scopes[scopeKey].on("error", error => {
                this.emit("error", error);
            });
        }
    }

    public readonly scope: Identifier;

    protected settings: TSettings;
    protected scopes: ScopedSettings<TSettings>;

    protected calculateSettings(settings: DeepPartial<TSettings>): TSettings {
        const wholeSettings = {
            ...(this.getDefaultSettings() as {}),
            ...(settings as {})
        } as TSettings;

        const validated = this.validate(wholeSettings);

        // We don't want to loose additional settings.
        const result = {
            ...(wholeSettings as {}),
            ...(validated as {})
        };

        return result as TSettings;
    }

    public get<TKey extends PrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey): TSettings[TKey] {
        return this.settings[key];
    }

    public getScope<TKey extends ExcludePrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey): SettingsScopeBase<TSettings[TKey]> {
        return this.scopes[key];
    }

    public getAllScopes(): ScopedSettings<TSettings> {
        return this.scopes;
    }

    // TODO: Prevent additional data loss.
    public hydrate(nextSettings: Partial<TSettings> = {}): void {
        const settings = this.calculateSettings(nextSettings) as { [key: string]: unknown };

        for (const key of Object.keys(nextSettings)) {
            const value: unknown = settings[key];

            if (!Helpers.isPrimitiveOrArrayOfPrimitives(value)) {
                if (this.scopes[key] != null) {
                    this.scopes[key].hydrate(value as {});
                }
            }
        }

        this.settings = settings as TSettings;

        const event: HydratedEvent = {
            scope: this.scope
        };
        this.emit("hydrated", event);
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

    public update<TKey extends PrimitiveAndPrimitiveArrayKeys<TSettings>>(key: TKey, value: TSettings[TKey]): void {
        if (this.settings[key] === value || !Helpers.isPrimitiveOrArrayOfPrimitives(value)) {
            return;
        }

        this.settings = this.calculateSettings({
            ...(this.settings as {}),
            [key]: value
        });

        const event: UpdatedEvent = {
            scope: this.scope,
            setting: {
                absoluteKey: this.scope.key + IdentifierHelpers.DELIMITER + key,
                key: key as string
            },
            // Already checked at the beginning.
            value: (value as unknown) as Primitive | Primitive[]
        };

        this.emit("updated", event);
    }

    protected abstract initScopedSettings(): ScopedSettings<TSettings>;
    public abstract getDefaultSettings(): ScopeSettings<TSettings>;

    protected validate(settings: ScopeSettings<TSettings>): ScopeSettings<TSettings> {
        return settings;
    }
}
