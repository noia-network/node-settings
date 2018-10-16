import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../../abstractions/settings-scope-base";
import { Validate } from "../../validator";

export interface WebSocketSettingsDto {
    isEnabled: boolean;
    ip: string;
    port: number;
}

export class WebSocketSettings extends SettingsScopeBase<WebSocketSettingsDto> {
    public getDefaultSettings(): ScopeSettings<WebSocketSettingsDto> {
        return {
            isEnabled: false,
            ip: "0.0.0.0",
            port: 7676
        };
    }

    protected initScopedSettings(): ScopesListSettings<WebSocketSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<WebSocketSettingsDto>): ScopeSettings<WebSocketSettingsDto> {
        const defaultValue = this.getDefaultSettings();

        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            ip: Validate(settings.ip, defaultValue.ip).isIpv4(),
            port: Validate(settings.port, defaultValue.port).isNetworkPort()
        };
    }
}
