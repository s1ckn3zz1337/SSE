/** TODO: due to a definition weakness, the models have to be MANUALLY synchronized with the schemas definitions */
export * from "./User";
export * from "./KeyRing";
export * from "./KeyEntity";

import {KeyEntity} from "./KeyEntity";

export interface IUser {
    id: string,
    username: string,
    password: string
}

export interface IKeyRing {
    id: string,
    description: string,
    keyEntites: KeyEntity[]
}

export interface IKeyEntity {
    id: string,
    keyName: string,
    keyEncryptedPassword: string,
    keyDescription: string,
    keyURL: string
}

export interface KeyPair {
    public: string,
    private: string
}