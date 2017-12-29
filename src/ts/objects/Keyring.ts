import {IKeyRing, KeyEntity} from "./Model";
import * as dbService from "../services/dbService";
import {KeyRingDocument} from "../database/schemes";

export class KeyRing implements IKeyRing {

    constructor(public id: string, public description: string, public keyEntites: KeyEntity[]) {
    }

    createKeyRing() {
        return new Promise<KeyRing>((resolve, reject) => {
            dbService.createNewKeyRing(this).then(response => {
                //dbService.persistKeyRing(this).then(response: KeyRing => {
                this.id = response.id;
                return resolve(this);
            }).catch(err => {
                return reject(err);
            });
        });
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