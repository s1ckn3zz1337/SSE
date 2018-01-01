import * as dbService from "../services/dbService";
import {KeyRingDocument} from "../database/schemes";
import {KeyEntity, IKeyEntity}  from "./KeyEntity";

export class KeyRing implements IKeyRing {

    constructor(public id: string, public name:  string, public description: string, public publicKey: string, public keyEntities: KeyEntity[]) {
    }

    public static getFromDocuments(docEntities: KeyRingDocument[]) {
        let entities = new Array<KeyRing>(docEntities.length);
        for (let i = 0; i < docEntities.length; i++) {
            let ringDoc = docEntities[i];
            entities[i] = KeyRing.getFromDocument(ringDoc);
        }
        return entities;
    }
    
    public static getFromDocument(ringDoc: KeyRingDocument): KeyRing{
        return new KeyRing(ringDoc.id, ringDoc.name, ringDoc.description, ringDoc.publicKey, KeyEntity.getFromDocuments(ringDoc.keyEntities));
    }
}
export interface IKeyRing {
    id: string,
    name: string,
    description: string,
    publicKey: string,
    keyEntities: IKeyEntity[]
}