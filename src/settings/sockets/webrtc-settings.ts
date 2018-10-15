import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../../abstractions/settings-scope-base";
import { Validate } from "../../validator";

export interface WebRtcSettingsDto {
    isEnabled: boolean;
    controlIp: string | null;
    controlPort: number;
    dataIp: string | null;
    dataPort: number;
}

export class WebRtcSettings extends SettingsScopeBase<WebRtcSettingsDto> {
    public getDefaultSettings(): ScopeSettings<WebRtcSettingsDto> {
        return {
            isEnabled: false,
            controlIp: "",
            controlPort: 0,
            dataIp: "",
            dataPort: 0
        };
    }

    protected initScopedSettings(): ScopesListSettings<WebRtcSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<WebRtcSettingsDto>): ScopeSettings<WebRtcSettingsDto> {
        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            controlIp: Validate(settings.controlIp, null).isString(false),
            controlPort: Validate(settings.controlPort).isNetworkPort(),
            dataIp: Validate(settings.dataIp, null).isString(false),
            dataPort: Validate(settings.dataPort).isNetworkPort()
        };
    }
}
