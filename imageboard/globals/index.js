"use strict";
var db = require("../db");
function getMenu(callback) {
    db.getMenus(callback);
}
exports.getMenu = getMenu;
function getFooter(callback) {
    db.getFeet(callback);
}
exports.getFooter = getFooter;
//# sourceMappingURL=index.js.map