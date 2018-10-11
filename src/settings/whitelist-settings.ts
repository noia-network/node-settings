import { SettingsScopeBase, ScopeSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface WhitelistSettingsDto {
    masters: string[];
}

export class WhitelistSettings extends SettingsScopeBase<WhitelistSettingsDto> {
    public getDefaultSettings(): ScopeSettings<WhitelistSettingsDto> {
        return {
            masters: ["*"]
        };
    }

    protected initScopedSettings(): ScopedSettings<WhitelistSettingsDto> {
        return {};
    }
}
