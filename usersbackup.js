var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
const rand = require("random-key");
var mongodb = require("mongodb");

router.use(cors());

router.post('/', function(req, res) {
  let attemptUser = req.body;
  let found = 0;
  
  fs.readFile("userList.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let users = JSON.parse(data);

    for(user in users){
      if(users[user].email == attemptUser.email && users[user].password == attemptUser.password){
        found = 1;
        let loggedIn = {id:users[user].id,newsletter_consent:users[user].newsletter_consent}
        res.send(JSON.stringify(loggedIn));
      }
    }

    if(found==0){
      res.status(403);
      res.send("login fail");
    }
  });
});

router.post('/newstoggle', function(req, res) {
  let userToToggle = req.body;
  
  fs.readFile("userList.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let users = JSON.parse(data);
    console.log(userToToggle);

    for(user in users){
      if(users[user].id == userToToggle.id){
        if(users[user].newsletter_consent == false){
          users[user].newsletter_consent = true;
          
        }
        else if(users[user].newsletter_consent == true){
          users[user].newsletter_consent = false;
        }
        fs.writeFile("userList.json", JSON.stringify(users, null, 2), function(err) {
          if (err) {
            console.log(err);
          }

        })  
        res.send("ok");
      }
    }

  });
});


router.post('/reg', function(req, res) {

  let newUser = req.body;

  fs.readFile("userList.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let users = JSON.parse(data);
    let found = 0;

    for(user in users){
      if(users[user].email == newUser.email){
        found = 1;
        res.status(409);
        res.send("fail due to dupe");
      }
    }

    if(found == 0){
      newUser.id = rand.generateDigits(10);
      users.push(newUser);

      fs.writeFile("userList.json", JSON.stringify(users, null, 2), function(err) {
        if (err) {
          console.log(err);
        }

        res.send("ok");
      })  

    }
  });
});



module.exports = router;
