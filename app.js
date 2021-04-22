var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

app.use(cors());

const MongoClient = require("mongodb").MongoClient; 




app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

let connectionString = "mongodb+srv://admin:"+process.env.API_KEY+"@newsletter.sxnqb.mongodb.net/Newsletter?retryWrites=true&w=majority";
console.log(connectionString);

MongoClient.connect(connectionString
, {
    useUnifiedTopology: true
})
.then(client =>  {
    console.log("Connection established");

    const db = client.db("newsletter");
    app.locals.db = db;
})

module.exports = app;
