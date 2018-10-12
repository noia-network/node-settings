import { SettingsScopeBase, ScopeSettings, ScopedSettings } from "../../abstractions/settings-scope-base";
import { Validate } from "../../validator";

export interface HttpSettingsDto {
    isEnabled: boolean;
    ip: string | null;
    port: number;
}

export class HttpSettings extends SettingsScopeBase<HttpSettingsDto> {
    public getDefaultSettings(): ScopeSettings<HttpSettingsDto> {
        return {
            isEnabled: false,
            ip: "",
            port: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<HttpSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<HttpSettingsDto>): ScopeSettings<HttpSettingsDto> {
        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            ip: Validate(settings.ip, null).isString(false),
            port: Validate(settings.port).isNetworkPort()
        };
    }
}
