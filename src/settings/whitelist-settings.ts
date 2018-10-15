import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";

export interface WhitelistSettingsDto {
    masters: string[];
}

export class WhitelistSettings extends SettingsScopeBase<WhitelistSettingsDto> {
    public getDefaultSettings(): ScopeSettings<WhitelistSettingsDto> {
        return {
            masters: ["*"]
        };
    }

    protected initScopedSettings(): ScopesListSettings<WhitelistSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<WhitelistSettingsDto>): ScopeSettings<WhitelistSettingsDto> {
        const mastersArray = Validate(settings.masters).isPrimitiveArray();
        let masters: string[];
        if (mastersArray.length === 0) {
            masters = this.getDefaultSettings().masters;
        } else {
            masters = mastersArray.map(x => Validate(x).isString()).filter(x => x !== "");
        }

        return {
            masters: masters
        };
    }
}
