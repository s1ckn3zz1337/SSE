import * as crypto from "crypto";
import *  as process from "child_process";
import { KeyPair } from "../../objects/Model";
import { json } from "express";
import { logFactory } from "../../config/ConfigLog4J";

export class Keygen {

    private static bits = 2048;
    private static threads = 0;
    private static queue: GenerationArgs[] = new Array<GenerationArgs>(30);

    /** https://www.npmjs.com/package/node-rsa */
    public static generateNewRSAKey(callback: (key: KeyPair) => any): void {
        let log = logFactory.getLogger(".keygen");
        log.info("" + Keygen.threads);
        if (Keygen.threads > 4) {
            Keygen.queue.push({ callback: callback });
        } else {
            Keygen.threads++;
            let child = process.fork("./build/services/keygen/AsyncKeygen.js");
            //child sends a message
            child.send(Keygen.bits);
            child.on("message", (message) => {
                Keygen.threads--;
                log.info("Key received");
                callback(message);
                setTimeout(() => {
                    let args = Keygen.queue.shift();
                    if (args) {
                        this.generateNewRSAKey(args.callback);
                    }
                });
            });
        }
    }
}

interface GenerationArgs {
    callback: (key: KeyPair) => void
}