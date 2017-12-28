import { IKeyRing, KeyEntity } from "./Model";

export class KeyRing implements IKeyRing {
    constructor(public schemaId: string, public descr: string, public keyEntites: KeyEntity[]) {
    }
}