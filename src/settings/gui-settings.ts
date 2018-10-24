import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";

export interface GuiSettingsDto {
    minimizeToTray: boolean;
}

export class GuiSettings extends SettingsScopeBase<GuiSettingsDto> {
    public getDefaultSettings(): ScopeSettings<GuiSettingsDto> {
        return {
            minimizeToTray: false
        };
    }

    protected initScopedSettings(): ScopesListSettings<GuiSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<GuiSettingsDto>): ScopeSettings<GuiSettingsDto> {
        const defaultValue = this.getDefaultSettings();

        return {
            minimizeToTray: Validate(settings.minimizeToTray, defaultValue.minimizeToTray).isBoolean()
        };
    }
}
