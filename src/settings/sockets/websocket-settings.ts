import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../../abstractions/settings-scope-base";

export interface WebSocketSettingsDto {
    isEnabled: boolean;
    ip: string;
    port: number;
}

export class WebSocketSettings extends SettingsScopeBase<WebSocketSettingsDto> {
    protected getDefaultSettings(): DefaultSettings<WebSocketSettingsDto> {
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
