import { Schema, model, SchemaDefinition, Document } from "mongoose";
import * as Models from "../objects/Model";

/** interfaces */
export interface IUser extends Document {
    username: String,
    email: String,
    password: String,
    keyrings: IKeyRing[]
}

export interface IKeyRing extends Document {
    schemaId: Schema.Types.ObjectId,
    keyEntites: IKeyEntity[]
}

export interface IKeyEntity extends Document {
    schemaId: Schema.Types.ObjectId,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
}

/** TODO sync schemas and interfaces */


export var keyEntitySchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
});

export var keyRingSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    keyEntites: [keyEntitySchema]
});

export var userSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    email: String,
    password: String,
    keyrings: [keyRingSchema]
});

export const KeyEntity = model<IKeyEntity>('KeyEntity', keyEntitySchema);
export const KeyRing = model<IKeyRing>('KeyRing', keyRingSchema);
export const UserSchema = model<IUser>('userSchema', userSchema);