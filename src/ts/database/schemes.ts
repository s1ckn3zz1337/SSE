import { Schema, model, SchemaDefinition, Document } from "mongoose";
import * as Models from "../objects/Model";

/** interfaces */
export interface UserDocument extends Document {
    _id: string,
    username: string,
    email: String,
    password: string,
    keyrings: KeyRingDocument[]
}

export interface KeyRingDocument extends Document {
    schemaId: Schema.Types.ObjectId,
    keyEntites: KeyEntityDocument[]
}

export interface KeyEntityDocument extends Document {
    schemaId: Schema.Types.ObjectId,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
}

/** TODO sync schemas and interfaces */


export const keyEntitySchema: Schema = new Schema({
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
});

export const keyRingSchema: Schema = new Schema({
    keyEntites: [keyEntitySchema]
});

export const userSchema: Schema = new Schema({
    username: String,
    password: String,
    keyrings: [keyRingSchema]
});

export const KeyEntity = model<KeyEntityDocument>('KeyEntity', keyEntitySchema);
export const KeyRing = model<KeyRingDocument>('KeyRing', keyRingSchema);
export const User = model<UserDocument>('User', userSchema);