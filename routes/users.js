var express = require('express');
var router = express.Router();
const rand = require("random-key");
const CryptoJS = require("crypto-js");
const mongodb = require("mongodb");

router.post('/', function(req, res){

  let attemptUser = req.body;

  req.app.locals.db.collection("userList").find({"email": attemptUser.email}).toArray()
  .then(results => {
    let user = results;

    if(user == false){
      res.status(403).send("Invalid username or password!");
    }

    else if(user[0].email == attemptUser.email){
        let decryptedPass = CryptoJS.AES.decrypt(user[0].password,process.env.SALT_KEY).toString(CryptoJS.enc.Utf8);
        if(decryptedPass == attemptUser.password){
          let loggedIn = {id:user[0].id,newsletter_consent:user[0].newsletter_consent};
          res.send(JSON.stringify(loggedIn));
        }
        else if(decryptedPass != attemptUser.password){
          res.status(403).send("Invalid username or password!");
        }
    } 
    
  })
})

router.post('/newstoggle', function(req, res) {
  let userToToggle = req.body;

  if(userToToggle.newsletter_consent == "false"){
    req.app.locals.db.collection("userList").updateOne({"id":userToToggle.id}, {$set: {"newsletter_consent": true}});
    res.send({"result": true});
  }

  else if(userToToggle.newsletter_consent == "true"){
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
      newReg.password = CryptoJS.AES.encrypt(newReg.password,process.env.SALT_KEY).toString();
      req.app.locals.db.collection("userList").insertOne(newReg);
      res.send("You have registered. Please log in with your new username and password.");
    }
    else{
      res.status(409).send("Email already exists in database.");
    }
  })

});



module.exports = router;