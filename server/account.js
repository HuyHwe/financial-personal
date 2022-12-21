// if (process.env.NODE_ENV != 'production') {
//     require('dotenv').config()
// }

const bcrypt = require('bcrypt');
const express = require('express');
const { Router } = require('express');
// const passport = require('passport');
// const flash = require('express-flash');
// const session = require('express-session');
const accountRouter = new Router();
const {Client} = require('pg')
const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    database: 'Financial'
});
client.connect();

function findUser(username) {
    client.query(`SELECT * FROM password WHERE person_username = '${username}'`, (error, resolve) => {
        if (error) {
            throw new Error(error);
        }
        console.log(resolve.rows)
        if (resolve.rows.length == 0) {
            return false
        } else return resolve.rows
    })
}
// const initializePassport = require('./passport-config');
// const { app } = require('./app');

// initializePassport(findUser);
// accountRouter.use(flash());
// accountRouter.use(session({
//     // secret: process.env.SESSION_SECRET,
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
// }))

// accountRouter.use(initializePassport);
// accountRouter.use(session);
// function hash(input){
//     return createHash('sha256').update(input).digest('hex')
// }

async function check_password  (input, password){
    const password_check = await bcrypt.compare(input, password);
    return password_check;
}


accountRouter.post('/signup', async (req, res, next) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);
    const userCheck = findUser(username);
    console.log(userCheck);
    if (userCheck) {
        res.send(`'username "${username}" already exist`);
    } else {
        client.query(`INSERT INTO password VALUES ('${password}', '${username}')`, (error, resolve) => {
            if (error) {
                throw new Error(error);
            }
            res.send({
                name: name,
                username: username});

        });
        client.query(`INSERT INTO person VALUES ('${name}', '${username}')`, (error, resolve) => {
            if (error) {
                throw new Error(error);
            }
        })
    }
            
});

        
accountRouter.post('/login', (req, res, next) => {
    const username = req.body.username;
    client.query(`SELECT password FROM password WHERE person_username = '${username}'`, (error, resolve) => {
        if (error) {
            res.send('username do not exist')
            throw new Error(error);
        }
        check_password(req.body.password, resolve.rows[0].password).then((result) => {
            res.send(result);
        })
    })
})

accountRouter.get(':username/information', (req, res, next) => {
    const username = req.params.username;
    client.query(`SELECT * FROM person WHERE username = ${username}`, (error, resolve) => {
        if (error) {
            throw new Error(error);
        }

        res.send(resolve.rows[0])
    })
})

module.exports = accountRouter;