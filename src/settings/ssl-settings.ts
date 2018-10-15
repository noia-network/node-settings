import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";

export interface SslSettingsDto {
    isEnabled: boolean;
    crtBundlePath: string | null;
    crtPath: string | null;
    privateKeyPath: string | null;
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

    protected initScopedSettings(): ScopesListSettings<SslSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<SslSettingsDto>): ScopeSettings<SslSettingsDto> {
        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            crtBundlePath: Validate(settings.crtBundlePath, null).isString(false),
            crtPath: Validate(settings.crtPath, null).isString(false),
            privateKeyPath: Validate(settings.privateKeyPath, null).isString(false)
        };
    }
}
