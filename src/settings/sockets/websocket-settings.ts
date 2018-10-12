import { SettingsScopeBase, ScopeSettings, ScopedSettings } from "../../abstractions/settings-scope-base";
import { Validate } from "../../validator";

export interface WebSocketSettingsDto {
    isEnabled: boolean;
    ip: string | null;
    port: number;
}

export class WebSocketSettings extends SettingsScopeBase<WebSocketSettingsDto> {
    public getDefaultSettings(): ScopeSettings<WebSocketSettingsDto> {
        return {
            isEnabled: false,
            ip: "",
            port: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<WebSocketSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<WebSocketSettingsDto>): ScopeSettings<WebSocketSettingsDto> {
        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            ip: Validate(settings.ip, null).isString(false),
            port: Validate(settings.port).isNetworkPort()
        };
    }
}
