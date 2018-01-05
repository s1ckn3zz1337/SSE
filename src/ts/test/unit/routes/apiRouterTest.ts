import {expect} from 'chai';
import {apiRouter} from "../../../routes/apiRouter";
import supertest = require("supertest");
import {Server} from '../../../app'
import * as dbService from '../../../services/dbService';
import {User} from "../../../objects/User";

const USERNAME = 'test12345';
const USERPASS = 'test12345';
const rightLogin = {
    'username': USERNAME,
    'password': USERPASS
};
describe('api router test', () => {
    let testUser: User;
    let app: Server;
    before(done => {
        app = Server.boostrap(3002);
        dbService.initDBConnection();
        testUser = new User('', USERNAME, USERPASS, 'test@email.com', [], false);
        dbService.registerUser(testUser).then(result => {
                done();
            }
        ).catch(err => {
                done(err)
            }
        )
    });
    after(done => {
        dbService.deleteUser(testUser.id).then(res => {
            done();
        }).catch(err => {
            done(err);
        })
    });
    describe('login test', () => {
        //todo -> mock the db for the tests or create and remove the entities

        it('should return 200 is the user is logged in', done => {
            supertest(app.app).post('/api/login').set('Content-Type', 'application/json').send(rightLogin).expect(200).end((err, res) => {
                if (err) throw err;
                done();
            });

        })
    })
});