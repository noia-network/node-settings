import { SettingsScopeBase, ScopeSettings, ScopesListSettings } from "../abstractions/settings-scope-base";
import { Validate } from "../validator";

export interface BlockchainSettingsDto {
    /**
     * Connect directy to master using masterAddress (ignores whitelist) if turned off.
     */
    isEnabled: boolean;
    /**
     * Node client address.
     */
    client: string | null;
    doCreateClient: boolean;
    lastBlockPosition: string | null;
    workOrder: string | null;
    walletAddress: string | null;
    walletProviderUrl: string | null;
}

export class BlockchainSettings extends SettingsScopeBase<BlockchainSettingsDto> {
    public getDefaultSettings(): ScopeSettings<BlockchainSettingsDto> {
        return {
            isEnabled: false,
            doCreateClient: false,
            client: "",
            walletAddress: "",
            lastBlockPosition: "",
            walletProviderUrl: "",
            workOrder: ""
        };
    }

    protected initScopedSettings(): ScopesListSettings<BlockchainSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<BlockchainSettingsDto>): ScopeSettings<BlockchainSettingsDto> {
        return {
            isEnabled: Validate(settings.isEnabled).isBoolean(),
            client: Validate(settings.client, null).isString(false),
            doCreateClient: Validate(settings.doCreateClient).isBoolean(),
            lastBlockPosition: Validate(settings.lastBlockPosition, null).isString(false),
            workOrder: Validate(settings.workOrder, null).isString(false),
            walletAddress: Validate(settings.walletAddress, null).isString(false),
            walletProviderUrl: Validate(settings.walletProviderUrl, null).isString(false)
        };
    }
}
