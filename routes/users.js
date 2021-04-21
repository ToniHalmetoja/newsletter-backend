var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
const rand = require("random-key");
var mongodb = require("mongodb");

router.use(cors());

router.post('/', function(req, res){
  let attemptUser = req.body;

  req.app.locals.db.collection("userList").find({"email": attemptUser.email, "password": attemptUser.password}).toArray()
  .then(results => {
    let user = results;
    if(user == false){
      res.status(403).send("Invalid username or password!");
    }
    else if(user[0].email == attemptUser.email && user[0].password == attemptUser.password){
        let loggedIn = {id:user[0].id,newsletter_consent:user[0].newsletter_consent};
        console.log(loggedIn);
        res.send(JSON.stringify(loggedIn));
        return;
    } 
  })
})

router.post('/newstoggle', function(req, res) {
  let userToToggle = req.body;

  if(userToToggle.newsletter_consent == "false"){
    console.log("beep");
    req.app.locals.db.collection("userList").updateOne({"id":userToToggle.id}, {$set: {"newsletter_consent": true}});
    
    res.send({"result": true});
  }

  else if(userToToggle.newsletter_consent == "true"){
    console.log("boop");
    req.app.locals.db.collection("userList").updateOne({"id":userToToggle.id}, {$set: {"newsletter_consent": false}});

    res.send({"result": false});
  }

});


router.post('/reg', function(req, res) {

  let newReg = req.body;

  req.app.locals.db.collection("userList").find({"email": newReg.email}).toArray()
  .then(result => {
    if(result == false){
      newReg.id = rand.generateDigits(10);
      req.app.locals.db.collection("userList").insertOne(newReg);
      res.send("You have registered. Please log in with your new username and password.");
    }
    else{
      res.status(409);
      res.send("Email already exists in database.");
    }
  })



  // let newUser = req.body;

  // fs.readFile("userList.json", function(err, data) {
  //   if(err) {
  //     console.log(err);
  //   }

  //   let users = JSON.parse(data);
  //   let found = 0;

  //   for(user in users){
  //     if(users[user].email == newUser.email){
  //       found = 1;
  //       res.status(409);
  //       res.send("fail due to dupe");
  //     }
  //   }

  //   if(found == 0){
  //     newUser.id = rand.generateDigits(10);
  //     users.push(newUser);

  //     fs.writeFile("userList.json", JSON.stringify(users, null, 2), function(err) {
  //       if (err) {
  //         console.log(err);
  //       }

  //       res.send("ok");
  //     })  

  //   }
  // });
});



module.exports = router;
