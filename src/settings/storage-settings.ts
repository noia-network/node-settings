import { SettingsScopeBase, ScopeSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface StorageSettingsDto {
    dir: string;
    size: number;
}

export class StorageSettings extends SettingsScopeBase<StorageSettingsDto> {
    public getDefaultSettings(): ScopeSettings<StorageSettingsDto> {
        return {
            dir: "",
            size: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<StorageSettingsDto> {
        return {};
    }
}
