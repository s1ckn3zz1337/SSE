import { Schema, Document } from "mongoose";

export interface IKeyEntity extends Document {
    _id: Schema.Types.ObjectId,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
}