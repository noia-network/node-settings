import { SettingsScopeBase, ScopeSettings, ScopedSettings } from "../../abstractions/settings-scope-base";

export interface HttpSettingsDto {
    isEnabled: boolean;
    ip: string;
    port: number;
}

export class HttpSettings extends SettingsScopeBase<HttpSettingsDto> {
    public getDefaultSettings(): ScopeSettings<HttpSettingsDto> {
        return {
            isEnabled: false,
            ip: "",
            port: 0
        };
    }

    protected initScopedSettings(): ScopedSettings<HttpSettingsDto> {
        return {};
    }
}
