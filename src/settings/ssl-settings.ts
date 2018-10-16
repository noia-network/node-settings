import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";

export interface SslSettingsDto {
    isEnabled: boolean;
    caBundlePath: string | null;
    crtPath: string | null;
    privateKeyPath: string | null;
}

export class SslSettings extends SettingsScopeBase<SslSettingsDto> {
    public getDefaultSettings(): ScopeSettings<SslSettingsDto> {
        return {
            isEnabled: false,
            caBundlePath: "",
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
            caBundlePath: Validate(settings.caBundlePath, null).isString(false),
            crtPath: Validate(settings.crtPath, null).isString(false),
            privateKeyPath: Validate(settings.privateKeyPath, null).isString(false)
        };
    }
}
