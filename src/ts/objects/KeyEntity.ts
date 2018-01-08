import {KeyEntityDocument} from "../database/schemes";

export class KeyEntity implements IKeyEntity {

    constructor(public id: string, public keyName: string, public keyEncryptedPassword: string, public keyDescription: string, public keyURL: string, public keyUsername: string) {
    }

    public static getFromDocuments(docEntities: KeyEntityDocument[]) {
        if (docEntities) {
            let entities = new Array<KeyEntity>(docEntities.length);
            for (let i = 0; i < docEntities.length; i++) {
                let keyDoc = docEntities[i];
                entities[i] = KeyEntity.getFromDocument(keyDoc);
            }
            return entities;
        } else {
            return [];
        }
    }

    public static getFromDocument(keyDoc: KeyEntityDocument): KeyEntity{
        return new KeyEntity(keyDoc.id, keyDoc.keyName, keyDoc.keyEncryptedPassword, keyDoc.keyDescription, keyDoc.keyURL, keyDoc.keyUsername);
    }
}

export interface IKeyEntity {
    id: string,
    keyName: string,
    keyEncryptedPassword: string,
    keyDescription: string,
    keyURL: string,
    keyUsername: string
}