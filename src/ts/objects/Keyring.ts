export class Keyring{
    constructor( public id:string, public descr:string, public keylist:Array<string>){
        this.id = id;
        this.descr = descr;
        this.keylist = keylist;
    }
}