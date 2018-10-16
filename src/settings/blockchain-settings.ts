import { generateMnemonic } from "bip39";

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
    clientAddress: string | null;
    doCreateClient: boolean;
    lastBlockPosition: string | null;
    workOrderAddress: string | null;
    airdropAddress: string | null;
    walletMnemonic: string;
    walletProviderUrl: string | null;
}

export class BlockchainSettings extends SettingsScopeBase<BlockchainSettingsDto> {
    public getDefaultSettings(): ScopeSettings<BlockchainSettingsDto> {
        return {
            isEnabled: true,
            doCreateClient: false,
            clientAddress: "",
            airdropAddress: "",
            walletMnemonic: "",
            lastBlockPosition: "",
            walletProviderUrl: "",
            workOrderAddress: ""
        };
    }

    protected initScopedSettings(): ScopesListSettings<BlockchainSettingsDto> {
        return {};
    }

    public validate(settings: ScopeSettings<BlockchainSettingsDto>): ScopeSettings<BlockchainSettingsDto> {
        const defaultValue = this.getDefaultSettings();

        return {
            isEnabled: Validate(settings.isEnabled, defaultValue.isEnabled).isBoolean(),
            doCreateClient: Validate(settings.doCreateClient, defaultValue.doCreateClient).isBoolean(),
            clientAddress: Validate(settings.clientAddress, null).isString(false),
            lastBlockPosition: Validate(settings.lastBlockPosition, null).isString(false),
            workOrderAddress: Validate(settings.workOrderAddress, null).isString(false),
            airdropAddress: Validate(settings.airdropAddress, null).isString(false),
            walletMnemonic: Validate(settings.walletMnemonic, () => generateMnemonic()).isString(false),
            walletProviderUrl: Validate(settings.walletProviderUrl, null).isString(false)
        };
    }
}
