import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { Primitive, OnlyPrimitiveKeys, ExceptPrimitivesProperties, OnlyPrimitivesProperties } from "../contracts/types-helpers";

export interface SettingsScopeEvents {
    updated: (key: string[], value: Primitive) => void;
    error: Error;
}

export type ScopedSettings<TValue> = {
    [T in keyof ExceptPrimitivesProperties<TValue>]: SettingsScopeBase<ExceptPrimitivesProperties<TValue>[T]>
};
export type DefaultSettings<TSettings> = OnlyPrimitivesProperties<TSettings>;

const SettingsScopeEmitter: { new (): StrictEventEmitter<EventEmitter, SettingsScopeEvents> } = EventEmitter;

export abstract class SettingsScopeBase<TSettings> extends SettingsScopeEmitter {
    constructor(settings: TSettings) {
        super();
        this.settings = settings;
    }

    protected readonly settings: TSettings;

    public get<TKey extends OnlyPrimitiveKeys<TSettings>>(key: TKey): TSettings[TKey] {
        return this.settings[key];
    }

    public update<TKey extends OnlyPrimitiveKeys<TSettings>>(key: TKey, value: TSettings[TKey]): void {
        this.settings[key] = value;
        this.emit("updated", [key as string], (value as any) as Primitive);
    }

    protected abstract initScopedSettings(): ScopedSettings<TSettings>;
    protected abstract getDefaultSettings(): DefaultSettings<TSettings>;
}
