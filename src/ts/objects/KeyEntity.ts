import { IKeyEntity } from "./Model";

export class KeyEntity {
    constructor(public keyId: string, public keyName: string, public keyEncryptedPassword: string, public keyDescription: string, public keyURL: string) {
    }
}