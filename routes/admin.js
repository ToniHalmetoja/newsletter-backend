var express = require('express');
var router = express.Router();
const CryptoJS = require("crypto-js");
var mongodb = require("mongodb");
let validated = 0;

/* GET users listing. */
router.get('/', function (req, res, next) {

  let adminLogin = `<title>Admin login</title>
                    <div><h2>Login as Admin</h2>
                    <form action="/admin/login" method="post">
                    <div><input type="text" name="adminName">Admin username</div>
                    <div><input type="password" name="adminPassword">Password</div>
                    <div><button type="submit">Log in</button></div></form></div>
                    `

  res.send(adminLogin);
});

router.post("/login", function (req, res) {

  let attemptUser = req.body.adminName;
  let attemptPass = req.body.adminPassword;

  req.app.locals.db.collection("admin").find({
      "name": attemptUser
    }).toArray()
    .then(results => {

      let admin = results;

      if (attemptPass == CryptoJS.AES.decrypt(admin[0].password, process.env.SALT_KEY).toString(CryptoJS.enc.Utf8)) {
        validated = 1;
        res.redirect("/admin/all");
      }

      if (validated == 0) {
        s
        res.status(403);
        res.send("Invalid username or password");
        return;
      }

    });
});

router.get("/logout", function (req, res) {
  validated = 0;
  res.redirect("/admin/all");
});


router.get("/all", function (req, res) {
  let htmlHead = `<head><style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  
  tr:nth-child(even) {
    background-color: #dddddd;
  }
  </style></head>`
  if (validated == 1) {

    htmlHead += `<title>Userlist</title><div><h2>All users</h2></div><div><table><tr><th>
    ID</th><th>Email</th><th>Wants newsletter?</th></tr>`

    req.app.locals.db.collection("userList").find().toArray()
      .then(results => {

        let users = results;

        for (user in users) {
          htmlHead += `<tr><td>${users[user].id}</td><td>${users[user].email}</td><td>${(users[user].newsletter_consent) ? "Yes" : "No"}</td></tr>`
        }

        htmlHead += `</table></div>`
        htmlHead += `<div><a href="/admin/newsletter">Show only users who want the newsletter</a></div>`
        htmlHead += `<div><a href="/admin/logout">Log out admin</a></div>`

        res.send(htmlHead);
      })

  } else {
    res.redirect("/admin");
  }
});

router.get("/newsletter", function (req, res) {
  if (validated == 1) {
    htmlHead += `<title>Userlist</title><div><h2>Newsletter subscribers</h2></div><table><tr><th>
    ID</th><th>Email</th></tr>`

    req.app.locals.db.collection("userList").find().toArray()
      .then(results => {

        let users = results;

        for (user in users) {
          if (users[user].newsletter_consent == true) {
            htmlHead += `<tr><td>${users[user].id}</td><td>${users[user].email}</td></tr>`
          }
        }

        htmlHead += `</table></div>`
        htmlHead += `<div><a href="/admin/all">Show all users</a></div>`
        htmlHead += `<div><a href="/admin/logout">Log out admin</a></div>`

        res.send(htmlHead);
      })
  } else {
    res.redirect("/admin");
  }
});

module.exports = router;