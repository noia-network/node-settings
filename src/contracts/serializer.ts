export interface Serializer<TObject> {
    serialize(content: string): TObject;
    deserialize(obj: TObject): string;
}
