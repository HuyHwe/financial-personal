const express = require('express');
const app = express();
const {Client} = require('pg')
const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    database: 'Financial'
});
client.connect();
const bodyParser = require('body-parser');
const walletRouter = require('./wallet');
const accountRouter = require('./account');

app.use(bodyParser.urlencoded({extended:true}));
app.use('/:username/wallet',(req, res, next) => {
    req.username = req.params.username;
    next();
}, walletRouter);
app.use('/account', accountRouter);

app.get('/:username', (req, res, next) => {   
    client.query(`SELECT * FROM person WHERE id = ${req.params.username}`, (err, response) => {
        if(err){
            return new Error('error lol');
        }
        userInformation = response.rows;
        res.send(userInformation[0].name);
        client.end;
    })
    
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log('listening to port ' + PORT)
})
module.exports = {app};