import { Schema, Document } from "mongoose";
import { IKeyEntity } from "./KeyEntity";

export interface IKeyRing extends Document {
    _id: Schema.Types.ObjectId,
    keyEntites: [IKeyEntity]
}