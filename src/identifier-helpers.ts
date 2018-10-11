import { Identifier } from "./contracts/settings-events";

export namespace IdentifierHelpers {
    export const DELIMITER: string = ".";

    export function isNameValid(name: string): boolean {
        return name.indexOf(DELIMITER) === -1;
    }

    export function addScope(scopeOrSetting: Identifier, scope: Identifier): Identifier {
        return {
            ...scopeOrSetting,
            absoluteKey: `${scope.key}${DELIMITER}${scopeOrSetting.absoluteKey}`
        };
    }
}
