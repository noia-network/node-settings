import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";

export interface ControllerSettingsDto {
    isEnabled: boolean;
    ip: string | null;
    port: number;
}

export class ControllerSettings extends SettingsScopeBase<ControllerSettingsDto> {
    public getDefaultSettings(): ScopeSettings<ControllerSettingsDto> {
        return {
            isEnabled: false,
            ip: "127.0.0.1",
            port: 9000
        };
    }

    protected initScopedSettings(): ScopesListSettings<ControllerSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<ControllerSettingsDto>): ScopeSettings<ControllerSettingsDto> {
        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            ip: Validate(settings.ip, null).isString(false),
            port: Validate(settings.port).isNetworkPort()
        };
    }
}
