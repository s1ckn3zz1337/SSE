import {IKeyEntity} from "./Model";
import {KeyEntityDocument} from "../database/schemes";

export class KeyEntity {
    constructor(public keyId: string, public keyName: string, public keyEncryptedPassword: string, public keyDescription: string, public keyURL: string) {
    }

    public static getFromDocument(docEntities: KeyEntityDocument[]) {
        if (docEntities) {
            let entities = new Array<KeyEntity>(docEntities.length);
            for (let i = 0; i < docEntities.length; i++) {
                let current = docEntities[i];
                entities[i] = new KeyEntity(current.id, current.keyName.toString(), current.keyEncryptedPassword.toString(), current.keyDescription.toString(), current.keyURL.toString());
            }
            return entities;
        } else {
            return [];
        }
    }
}