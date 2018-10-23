import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { DEFAULT_STORAGE_PATH } from "./constants";
import { Validate } from "../validator";

export interface StorageSettingsDto {
    dir: string;
    size: number;
}

export class StorageSettings extends SettingsScopeBase<StorageSettingsDto> {
    public getDefaultSettings(): ScopeSettings<StorageSettingsDto> {
        return {
            dir: DEFAULT_STORAGE_PATH,
            size: 0
        };
    }

    protected initScopedSettings(): ScopesListSettings<StorageSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<StorageSettingsDto>): ScopeSettings<StorageSettingsDto> {
        const defaultSettings = this.getDefaultSettings();

        return {
            dir: Validate(settings.dir, defaultSettings.dir).isString(false),
            size: Validate(settings.size, defaultSettings.size).isNumber()
        };
    }
}
