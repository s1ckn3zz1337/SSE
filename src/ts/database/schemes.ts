import { Schema, model, SchemaDefinition, Document } from "mongoose";
import * as Models from "../objects/Model";

/** interfaces */
export interface UserDocument extends Document {
    username: String,
    email: String,
    password: String,
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
    _id: Schema.Types.ObjectId,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
});

export const keyRingSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    keyEntites: [keyEntitySchema]
});

export const userSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    password: String,
    keyrings: [keyRingSchema]
});

export const KeyEntity = model<KeyEntityDocument>('KeyEntity', keyEntitySchema);
export const KeyRing = model<KeyRingDocument>('KeyRing', keyRingSchema);
export const User = model<UserDocument>('userSchema', userSchema);