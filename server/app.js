const express = require('express');
const app = express();
const {Client} = require('pg')
const client = new Client({
    host: 'ec2-44-194-92-192.compute-1.amazonaws.com',
    user: 'mnqkzkedmpncrq',
    port: 5432,
    database: 'd15qumjtqi1hkk',
    password: '5ea96a39e17e5f42e701873a078156a073911985bd4ce354844c80488affb8e3',
    ssl: true
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


app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
    console.log('listening to port ' + app.get('port'))
})
module.exports = {app};