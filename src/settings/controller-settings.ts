import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface ControllerSettingsDto {
    isEnabled: boolean;
    ip: string;
    port: number;
}

export class ControllerSettings extends SettingsScopeBase<ControllerSettingsDto> {
    public getDefaultSettings(): DefaultSettings<ControllerSettingsDto> {
        return {
            isEnabled: false,
            ip: "127.0.0.1",
            port: 9000
        };
    }

    protected initScopedSettings(): ScopedSettings<ControllerSettingsDto> {
        return {};
    }
}
