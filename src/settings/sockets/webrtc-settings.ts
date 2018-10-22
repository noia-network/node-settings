import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../../abstractions/settings-scope-base";
import { Validate } from "../../validator";

export interface WebRtcSettingsDto {
    isEnabled: boolean;
    controlIp: string;
    controlPort: number;
    dataIp: string;
    dataPort: number;
}

export class WebRtcSettings extends SettingsScopeBase<WebRtcSettingsDto> {
    public getDefaultSettings(): ScopeSettings<WebRtcSettingsDto> {
        return {
            isEnabled: true,
            controlIp: "0.0.0.0",
            controlPort: 8048,
            dataIp: "0.0.0.0",
            dataPort: 8058
        };
    }

    protected initScopedSettings(): ScopesListSettings<WebRtcSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<WebRtcSettingsDto>): ScopeSettings<WebRtcSettingsDto> {
        const defaultValue = this.getDefaultSettings();

        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            controlIp: Validate(settings.controlIp, defaultValue.controlIp).isIpv4(),
            controlPort: Validate(settings.controlPort, defaultValue.controlPort).isNetworkPort(),
            dataIp: Validate(settings.dataIp, defaultValue.dataIp).isIpv4(),
            dataPort: Validate(settings.dataPort, defaultValue.dataPort).isNetworkPort()
        };
    }
}
