import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface StorageSettingsDto {
    dir: string;
    size: number;
}

export class StorageSettings extends SettingsScopeBase<StorageSettingsDto> {
    protected getDefaultSettings(): DefaultSettings<StorageSettingsDto> {
        return {
            dir: "",
            size: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<StorageSettingsDto> {
        return {};
    }
}
