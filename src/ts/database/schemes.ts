import {Schema, model, SchemaDefinition, Document} from "mongoose";

/** TODO sync schemas and interfaces */

/** Key entity */
export const keyEntitySchema: Schema = new Schema({
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
});

export interface KeyEntityDocument extends Document {
    keyName: string,
    keyEncryptedPassword: string,
    keyDescription: string,
    keyURL: string
}

/** Key Ring */
export const keyRingSchema: Schema = new Schema({
    name: String,
    description: String,
    keyEntites: [keyEntitySchema]
});
export interface KeyRingDocument extends Document {
    name: string,
    description: string,
    keyEntites: KeyEntityDocument[]
}

/** User */
export const userSchema: Schema = new Schema({
    username: String,
    password: String,
    email: String,
    keyrings: [keyRingSchema]
});

export interface UserDocument extends Document {
    username: string,
    email: string,
    password: string,
    keyrings: KeyRingDocument[]
}

export const KeyEntity = model<KeyEntityDocument>('KeyEntity', keyEntitySchema);
export const KeyRing = model<KeyRingDocument>('KeyRing', keyRingSchema);
export const User = model<UserDocument>('User', userSchema);