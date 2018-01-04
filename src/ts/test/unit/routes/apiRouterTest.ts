import {expect} from 'chai';
import {apiRouter} from "../../../routes/apiRouter";
import supertest = require("supertest");
import {Server} from '../../../app'

describe('api router test', () => {
    describe('login test', () => {
        //todo -> mock the db for the tests
        const rightLogin = {
            'username': 'test',
            'password': 'test'
        };
        const app = Server.boostrap(3001);
        it('should return 200 is the user is logged in', done => {
            supertest(app.app).post('/api/login').set('Content-Type', 'application/json').send(rightLogin).expect(200).end((err, res) => {
                if(err) throw err;
                done();
            });

        })
    })
});