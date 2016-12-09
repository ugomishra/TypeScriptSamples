"use strict";

import * as db from "../db";

export function getMenu(callback) {
	db.getMenus(callback);
}