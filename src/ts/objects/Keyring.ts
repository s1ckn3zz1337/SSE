import * as Model from "./Model";

export class KeyRing {
    constructor(public schemaId: string, public descr: string, public keyEntites: Model.KeyEntity[]) {
    }
}