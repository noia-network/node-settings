import { SettingsScopeBase, ScopeSettings, ScopedSettings } from "../../abstractions/settings-scope-base";

export interface WebSocketSettingsDto {
    isEnabled: boolean;
    ip: string;
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
}
