import { Primitive } from "./contracts/types-helpers";

export namespace Helpers {
    export function randomString(len: number = 5): string {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < len; i += 1) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    export function isPrimitiveOrArrayOfPrimitives(a: unknown): a is Primitive | Array<Primitive> {
        return typeof a === "string" || typeof a === "number" || typeof a === "boolean" || a == null || Array.isArray(a);
    }
}
