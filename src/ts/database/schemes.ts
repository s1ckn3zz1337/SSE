import { Document, Schema, Model, model} from "mongoose";

export var keyEntity:Schema = new Schema({
    _id: Schema.Types.ObjectId,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
});

export var keyRing:Schema = new Schema({
    _id: Schema.Types.ObjectId,
    keyEntites: [keyEntity]
});

export var userSchema:Schema = new Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    email: String,
    password: String,
    keyrings: [keyRing]
});

export var KeyEntity = model('KeyEntity', keyEntity);
export var KeyRing = model('KeyRing', keyRing);
export var UserSchema = model('userSchema', userSchema);