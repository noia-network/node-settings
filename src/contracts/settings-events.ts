import { Primitive } from "./types-helpers";

export interface Identifier {
    key: string;
    absoluteKey: string;
}

export interface UpdatedEvent {
    scope: Identifier;
    setting: Identifier;
    value: Primitive | Primitive[];
    prevValue: Primitive | Primitive[];
}

export interface HydratedEvent {
    scope: Identifier;
}

export interface DeepUpdatedEvent {
    scope: Identifier;
}
