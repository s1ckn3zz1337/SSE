
import { KeyPair } from "../../objects/model";
import { logFactory } from "../../config/ConfigLog4J";
import * as NodeRSA from "node-rsa";


const encoding = "base64";
const log = logFactory.getLogger(".childKeygen");

process.on("message", (bits: number) => {
    log.info("Generating key");
    if (process && process.send) {
        let keyPair: KeyPair = createKeyPair(bits);
        if (keyPair) {
            log.info("Sending keyPair");
            process.send(keyPair);
        } else {
            process.send("error");
        }
    }
    return process.exit();
});

function createKeyPair(bits?: number) {
    let key = new NodeRSA();
    key.generateKeyPair(bits);
    return {
        public: key.exportKey('pkcs8-public-pem').toString(),
        private: key.exportKey('pkcs8-private-pem').toString()
    };
}