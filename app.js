var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb+srv://admin:Tc7UAB2QqnU6FZE@newsletter.sxnqb.mongodb.net/Newsletter?retryWrites=true&w=majority"
, {
    useUnifiedTopology: true
})
.then(client =>  {
    console.log("Connection established");

    const db = client.db("newsletter");
    app.locals.db = db;
})


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

module.exports = app;
