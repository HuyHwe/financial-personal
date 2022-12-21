const express = require('express');
const { Router } = require('express');
const walletRouter = new Router();
const {Client} = require('pg')
const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    database: 'Financial'
});
client.connect();
walletRouter.get('/', (req, res, next) => {
    client.query(`SELECT * FROM wallet WHERE person_username = '${req.username}'`, (err, resolve) => {
        if (err) {
            throw new Error(err);
        }
        walletInformation = resolve.rows;
        res.send(walletInformation);
        client.end;
    })
})

walletRouter.get('/transaction', (req, res, next) => {
    client.query(`SELECT transaction.id, name, transaction.description, money_change FROM transaction JOIN transaction_type ON transaction.type = transaction_type.id ORDER BY transaction.id DESC`, (err, resolve) => {
        if(err){
            throw new Error(err);
        }
        transactionInformation = resolve.rows;
        res.send(transactionInformation);
        client.end;
    })
})

walletRouter.post('/transaction',(req, res, next) => {

    client.query(`INSERT INTO transaction(description, type, wallet_id, money_change) VALUES ('${req.body.description}', ${req.body.type}, ${req.body.wallet_id}, ${req.body.money_change})`, (error, resolve) => {
        if (error) {
            throw new Error(error);
        }
        client.end;
    })
    
    client.query(`UPDATE wallet SET total_money = total_money + ${req.body.money_change} WHERE id = ${req.body.wallet_id}`, (error, resolve) => {
        if(error){
            throw new Error(error);
        }
        client.query(`SELECT total_money FROM wallet WHERE id = ${req.body.wallet_id}`, (error, resolve) => {
            if (error) {
                throw new Error(error);
            }
            res.send(resolve.rows[0]);
        });
    })
})

walletRouter.get('/transaction/:walletId', (req, res, next) => {
    const walletId = req.params.walletId;
    client.query(`SELECT * FROM transaction WHERE wallet_id = ${walletId} ORDER BY id DESC`, (error, resolve) => {
        if (error) {
            throw new Error(error)
        }
        res.send(resolve.rows);
    })
})

walletRouter.get('/transaction/:walletId/:time', (req, res, next) => {
    let time = req.params.time;
    const walletId = req.params.walletId;
    switch (time) {
        case 'today': time = 1; break;
        case 'this-week': time = 7; break;
        case 'this-month': time = 30; break;
        default: time = null
    }
    console.log(time);
    client.query(`SELECT * FROM transaction WHERE wallet_id = '${walletId}' AND datetime >= now() - interval '${time} day'`, (error, resolve) => {
        if (error) {
            throw new Error(error)
        }

        res.send(resolve.rows);
    })
})
module.exports = walletRouter;