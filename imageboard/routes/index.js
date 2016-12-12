"use strict";
var db = require("../db");
function index(req, res) {
    db.getUsers(function (users) {
        console.dir(users);
        res.render('index', { title: 'ImageBoard', users: users });
    });
}
exports.index = index;
;
function login(req, res) {
    console.log(req.body);
    db.checkUser({}, function (auth) {
        console.dir(auth);
    });
}
exports.login = login;
;
//# sourceMappingURL=index.js.map