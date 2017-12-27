import { Schema, model, SchemaDefinition } from "mongoose";
import * as Models from "../model/Model";

/** TODO: due to a definition weakness, the schemas have to be MANUALLY synchronized with the model definitions */
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

export var KeyEntity = model<Models.IKeyEntity>('KeyEntity', keyEntitySchema);
export var KeyRing = model<Models.IKeyRing>('KeyRing', keyRingSchema);
export var UserSchema = model<Models.IUser>('userSchema', userSchema);