import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface SslSettingsDto {
    isEnabled: boolean;
    crtBundlePath: string;
    crtPath: string;
    privateKeyPath: string;
}

export class SslSettings extends SettingsScopeBase<SslSettingsDto> {
    protected getDefaultSettings(): DefaultSettings<SslSettingsDto> {
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
