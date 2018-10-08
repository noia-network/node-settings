import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface WhitelistSettingsDto {
    masters: string[];
}

export class WhitelistSettings extends SettingsScopeBase<WhitelistSettingsDto> {
    protected getDefaultSettings(): DefaultSettings<WhitelistSettingsDto> {
        return {
            masters: []
        };
    }

    protected initScopedSettings(): ScopedSettings<WhitelistSettingsDto> {
        return {};
    }
}
