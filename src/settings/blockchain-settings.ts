import { SettingsScopeBase, DefaultSettings, ScopedSettings } from "../abstractions/settings-scope-base";

export interface BlockchainSettingsDto {
    /**
     * Connect directy to master using masterAddress (ignores whitelist) if turned off.
     */
    isEnabled: boolean;
    /**
     * Node client address.
     */
    client: string;
    doCreateClient: boolean;
    lastBlockPosition: string;
    workOrder: string;
    address: string;
    mnemonic: string;
    providerUrl: string;
}

export class BlockchainSettings extends SettingsScopeBase<BlockchainSettingsDto> {
    public getDefaultSettings(): DefaultSettings<BlockchainSettingsDto> {
        return {
            isEnabled: false,
            doCreateClient: false,
            client: "",
            address: "",
            lastBlockPosition: "",
            mnemonic: "",
            providerUrl: "",
            workOrder: ""
        };
    }

    protected initScopedSettings(): ScopedSettings<BlockchainSettingsDto> {
        return {};
    }
}
