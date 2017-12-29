import {Schema, model, SchemaDefinition, Document} from "mongoose";
import * as Models from "../objects/Model";

/** TODO sync schemas and interfaces */

/** Key entity */
export const keyEntitySchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
});

export interface KeyEntityDocument extends Document {
    schemaId: Schema.Types.ObjectId,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
}

/** Key Ring */
export const keyRingSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    keyEntites: [keyEntitySchema]
});
export interface KeyRingDocument extends Document {
    schemaId: Schema.Types.ObjectId,
    keyEntites: KeyEntityDocument[]
}

/** User */
export const userSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    password: String,
    email: String,
    keyrings: [keyRingSchema]
});

export interface UserDocument extends Document {
    _id: string,
    username: string,
    email: string,
    password: string,
    keyrings: KeyRingDocument[]
}

export const KeyEntity = model<KeyEntityDocument>('KeyEntity', keyEntitySchema);
export const KeyRing = model<KeyRingDocument>('KeyRing', keyRingSchema);
export const User = model<UserDocument>('userSchema', userSchema);