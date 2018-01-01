import {Schema, model, SchemaDefinition, Document} from "mongoose";

/** TODO sync schemas and interfaces */

/** Key entity */
export const keyEntitySchema: Schema = new Schema({
    keyName: {type: String, required: true},
    keyEncryptedPassword: {type: String, required: true},
    keyDescription: String,
    keyURL: String
});

export interface KeyEntityDocument extends Document {
    keyName: string,
    keyEncryptedPassword: string,
    keyDescription?: string,
    keyURL?: string
}

/** Key Ring */
export const keyRingSchema: Schema = new Schema({
    name: {type: String, required: true},
    description: String,
    publicKey: {type: String, required: true},
    keyEntities: [{type: Schema.Types.ObjectId, ref: "KeyEntity"}]
});
export interface KeyRingDocument extends Document {
    name: string,
    description?: string,
    publicKey: string
    keyEntities?: KeyEntityDocument[]
}

/** User */
export const userSchema: Schema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    keyrings: [{type: Schema.Types.ObjectId, ref: "KeyRing"}]
});

export interface UserDocument extends Document {
    username: string,
    password: string,
    email: string,
    keyrings?: KeyRingDocument[]
}

export const KeyEntity = model<KeyEntityDocument>('KeyEntity', keyEntitySchema);
export const KeyRing = model<KeyRingDocument>('KeyRing', keyRingSchema);
export const User = model<UserDocument>('User', userSchema);