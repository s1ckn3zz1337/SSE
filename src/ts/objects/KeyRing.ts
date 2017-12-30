import {IKeyRing, KeyEntity, User} from "./Model";
import * as dbService from "../services/dbService";
import {KeyRingDocument} from "../database/schemes";

export class KeyRing implements IKeyRing {

    constructor(public id: string, public description: string, public keyEntites: KeyEntity[]) {
    }

    public static getFromDocument(docEntities: KeyRingDocument[]) {
        let entities = new Array<KeyRing>(docEntities.length);
        for (let i = 0; i < docEntities.length; i++) {
            let current = docEntities[i];
            entities[i] = new KeyRing(current.id, current.description, KeyEntity.getFromDocument(current.keyEntites));
        }
        return entities;
    }
}