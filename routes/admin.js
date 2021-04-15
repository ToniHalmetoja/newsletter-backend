var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");

/* GET users listing. */
router.get('/', function(req, res, next) {
      let adminLogin = `<title>Admin logim</title>
                    <div><h2>Login as Admin</h2>
                    <form action="/admin/login" method="post">
                    <div><input type="text" name="adminName">Admin username</div>
                    <div><input type="password" name="adminPassword">Password</div>
                    <div><button type="submit">Log in</button></div></form></div>
                    `
    
                    res.send(adminLogin);
});

router.post("/login", function(req, res) {

  console.log(req.body);


})


module.exports = router;
