import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../../abstractions/settings-scope-base";

export interface WebRtcSettingsDto {
    isEnabled: boolean;
    controlIp: string;
    controlPort: number;
    dataIp: string;
    dataPort: number;
}

export class WebRtcSettings extends SettingsScopeBase<WebRtcSettingsDto> {
    protected getDefaultSettings(): DefaultSettings<WebRtcSettingsDto> {
        return {
            isEnabled: false,
            controlIp: "",
            controlPort: 0,
            dataIp: "",
            dataPort: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<WebRtcSettingsDto> {
        return {};
    }
}
