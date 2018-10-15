import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";

export interface StorageSettingsDto {
    dir: string | null;
    size: number;
}

export class StorageSettings extends SettingsScopeBase<StorageSettingsDto> {
    public getDefaultSettings(): ScopeSettings<StorageSettingsDto> {
        return {
            dir: "",
            size: 0
        };
    }

    protected initScopedSettings(): ScopesListSettings<StorageSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<StorageSettingsDto>): ScopeSettings<StorageSettingsDto> {
        return {
            dir: Validate(settings.dir, null).isString(false),
            size: Validate(settings.size).isNumber()
        };
    }
}
