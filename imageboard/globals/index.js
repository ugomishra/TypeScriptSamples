"use strict";
var db = require("../db");
function getMenu(callback) {
    db.getMenus(callback);
}
exports.getMenu = getMenu;
//# sourceMappingURL=index.js.map