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

    export function primitiveArraysAreEqual(a1: Primitive[], a2: Primitive[]): boolean {
        if (a1.length !== a2.length) {
            return false;
        }

        // Lenghts are equal.
        for (let i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }

        return true;
    }
}
