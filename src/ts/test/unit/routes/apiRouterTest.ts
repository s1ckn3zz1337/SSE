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
const wrongLogin = {
    'username' : 'not_working',
    'password' : 'not_working'
};
const rightRegister = {
    'username' : 'reg_test',
    'password' : '1234',
    'email' : 'test1234@mail.com'
};
const wrongRegister = {
    'username' : USERNAME,
    'password' : USERPASS,
    'email' : 'someemaol@google.com'
};
describe('api router test', () => {
    let testUser: User;
    let app: Server;
    let createdUserId: string;
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
            if(createdUserId) dbService.deleteUser(createdUserId).then( res2 => {
                app.shutdown();
                done();
            });
        }).catch(err => {
            done(err);
        })
    });
    describe('login test', () => {
        //todo -> mock the db for the tests or create and remove the entities

        it('should return 200 if the user is logged in', done => {
            supertest(app.app).post('/api/login').set('Content-Type', 'application/json').send(rightLogin).expect(200).end((err, res) => {
                if (err) done(err);
                else done();
            });

        });
        it('should return 403 if user doesnt exist', done => {
            supertest(app.app).post('/api/login').set('Content-Type', 'application/json').send(wrongLogin).expect(403).end((err, res) => {
                if (err) done(err);
                else done();
            });
        });
        it('should return 403 if data is wrong', done => {
            supertest(app.app).post('/api/login').set('Content-Type', 'application/json').send({}).expect(400).end((err, res) => {
                if (err) done(err);
                else done();
            });
        });
    });
    describe('register test', () => {
        this.timeout = 5000;
        it('should return new user on success', done => {
            supertest(app.app).post('/api/register').set('Content-Type', 'application/json').send(rightRegister).expect(201).end((err, res) => {
                if (err) done(err);
                else {
                    createdUserId = res.body.id;
                    done();
                }
            });
        });
        it('should return 400 if missing params', done => {
            supertest(app.app).post('/api/register').set('Content-Type', 'application/json').send({}).expect(400).end((err, res) => {
                if (err) done(err);
                else done();
            });
        });
        it('should return 500 on trying to create multiple users', done => {
            supertest(app.app).post('/api/register').set('Content-Type', 'application/json').send(wrongRegister).expect(500).end((err, res) => {
                if (err) done(err);
                else done();
            });
        });
    })
});