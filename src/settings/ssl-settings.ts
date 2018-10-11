import { SettingsScopeBase, ScopeSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface SslSettingsDto {
    isEnabled: boolean;
    crtBundlePath: string;
    crtPath: string;
    privateKeyPath: string;
}

export class SslSettings extends SettingsScopeBase<SslSettingsDto> {
    public getDefaultSettings(): ScopeSettings<SslSettingsDto> {
        return {
            isEnabled: false,
            crtBundlePath: "",
            crtPath: "",
            privateKeyPath: ""
        };
    }

    protected initScopedSettings(): ScopedSettings<SslSettingsDto> {
        return {};
    }
}
