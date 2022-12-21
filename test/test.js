const { assert } = require('chai');
const chai = require('chai');
const request = require('supertest')
const {app} = require('../server/app');

describe('/:userId', () => {
    it('get the prefered user information',async () => {

        const expected = {name:'huy'};
        const response = await request(app)
                        .get('/1')
                        
    
        assert.deepEqual(response.body, expected);
    })
})