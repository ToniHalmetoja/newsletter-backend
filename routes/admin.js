var express = require('express');
var router = express.Router();
const fs = require("fs");
let validated = 0;

/* GET users listing. */
router.get('/', function(req, res, next) {
      let adminLogin = `<title>Admin login</title>
                    <div><h2>Login as Admin</h2>
                    <form action="/admin/login" method="post">
                    <div><input type="text" name="adminName">Admin username</div>
                    <div><input type="password" name="adminPassword">Password</div>
                    <div><button type="submit">Log in</button></div></form></div>
                    `
    
                    res.send(adminLogin);
});

router.post("/login", function(req, res) {

  let attemptUser = req.body.adminName;
  let attemptPass = req.body.adminPassword;

  fs.readFile("adminList.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let admins = JSON.parse(data);


    for(user in admins){
      if(admins[user].username == attemptUser && admins[user].password == attemptPass){
        validated = 1;
        res.redirect("/admin/all");
      }
    }

    if(validated==0){
      res.status(403);
      res.send("Invalid username or password"); 
      return;
    }
  });
});

router.get("/logout", function(req, res) {
  validated = 0;
  res.redirect("/admin/all");
});


router.get("/all", function(req, res) {
  if(validated == 1){

    let htmlHead = `<title>Userlist</title><div><h2>All users</h2></div>`

    fs.readFile("userList.json", function(err, data) {
      if(err) {
        console.log(err);
      }

      let users = JSON.parse(data);

      for (user in users) {
        htmlHead += `<div><b>ID:</b> ${users[user].id} <b>Email:</b> ${users[user].email} <b>Wants newsletter?</b> ${ (users[user].newsletter_consent) ? "Yes" : "No"}</div>`
      }

      htmlHead += `<div><a href="/admin/newsletter">Show only users who want the newsletter</a></div>`
      htmlHead +=`<div><a href="/admin/logout">Log out admin</a></div>`

      res.send(htmlHead);
    })
  }
  else{
    res.redirect("/admin");
  }
});


router.get("/newsletter", function(req, res) {
  if(validated == 1){
    let htmlHead = `<title>Userlist</title><div><h2>Newsletter subscribers</h2></div>`

    fs.readFile("userList.json", function(err, data) {
      if(err) {
        console.log(err);
      }

      let users = JSON.parse(data);

      for (user in users) {
        if(users[user].newsletter_consent == true){
          htmlHead += `<div><b>ID:</b> ${users[user].id} <b>Email:</b> ${users[user].email} </div>`
        }
      }

      htmlHead += `<div><a href="/admin/all">Show all users</a></div>`
      htmlHead +=`<div><a href="/admin/logout">Log out admin</a></div>`

      res.send(htmlHead);
    })
  }

  else{
    res.redirect("/admin");
  }
});




module.exports = router;
