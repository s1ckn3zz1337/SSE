import { KeyPair } from "../../objects/Model";
import { logFactory } from "../../config/ConfigLog4J";
import * as NodeRSA from "node-rsa";
const log = logFactory.getLogger(".keygen");
export class Keygen {

    private static bits = 2048;
    /** https://www.npmjs.com/package/node-rsa */
    // todo THIS SHOULD BE on the client???
    public static generateNewRSAKey(): Promise<KeyPair> {
        return new Promise((resolve) => {
            const keys = new NodeRSA({b:Keygen.bits});
            return resolve({
                public: keys.exportKey('pkcs8-public-pem').toString(),
                private: keys.exportKey('pkcs8-private-pem').toString()
            });
        });
    }

    public static encrypt(password: string, publicKey: string): string{
        return new NodeRSA(publicKey, 'pkcs8-public-pem').encrypt(password, "base64");
    }

    public static decrypt(encryptedPassword: string, privateKey: string): string{
        return new NodeRSA(privateKey, 'pkcs8-private-pem').decrypt(encryptedPassword, "ascii");
    }
}