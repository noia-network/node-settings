import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../../abstractions/settings-scope-base";
import { Validate } from "../../validator";

export interface HttpSettingsDto {
    isEnabled: boolean;
    ip: string;
    port: number;
}

export class HttpSettings extends SettingsScopeBase<HttpSettingsDto> {
    public getDefaultSettings(): ScopeSettings<HttpSettingsDto> {
        return {
            isEnabled: false,
            ip: "0.0.0.0",
            port: 6767
        };
    }

    protected initScopedSettings(): ScopesListSettings<HttpSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<HttpSettingsDto>): ScopeSettings<HttpSettingsDto> {
        const defaultValue = this.getDefaultSettings();

        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            ip: Validate(settings.ip, defaultValue.ip).isIpv4(),
            port: Validate(settings.port, defaultValue.port).isNetworkPort()
        };
    }
}
