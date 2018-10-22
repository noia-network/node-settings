import * as ini from "ini";
import { Serializer } from "../contracts/serializer";

export interface IniSerializer<TObject> extends Serializer<TObject> {}

export function createIniSerializer<TObject>(scopeKey?: string): IniSerializer<TObject> {
    return {
        serialize: content => {
            if (content === "" || content == null) {
                return {};
            }

            const decoded = ini.decode(content);
            if (scopeKey != null) {
                const scopedData = decoded[scopeKey];
                return typeof scopedData === "object" ? scopedData : {};
            } else {
                return decoded;
            }
        },
        deserialize: obj => {
            let iniData: string;
            if (scopeKey != null) {
                iniData = ini.encode({ [scopeKey]: obj });
            } else {
                iniData = ini.encode(obj);
            }

            return iniData;
        }
    };
}
