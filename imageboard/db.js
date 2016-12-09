"use strict";
// Mongo
var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017, { auto_reconnect: true });
var db = new mongodb.Db('mydb', server, { w: 1 });
db.open(function () { });
function getUser(id, callback) {
    db.collection('users', function (error, users) {
        if (error) {
            console.error(error);
            return;
        }
        users.find({ _id: id }).batchSize(10).nextObject(function (error, user) {
            if (error) {
                console.error(error);
                return;
            }
            callback(user);
        });
    });
}
exports.getUser = getUser;
function getMenus(callback) {
    db.collection('menus', function (error, menus_collection) {
        if (error) {
            console.error(error);
            return;
        }
        menus_collection.find({}, { '_id': 1, 'href': 1, 'name': 1 }).toArray(function (error, menuobjs) {
            if (error) {
                console.error(error);
                return;
            }
            callback(menuobjs);
        });
    });
}
exports.getMenus = getMenus;
function getFeet(callback) {
    db.collection('feet', function (error, feet_collection) {
        if (error) {
            console.error(error);
            return;
        }
        feet_collection.find({}, { '_id': 1, 'href': 1, 'name': 1 }).toArray(function (error, footobjs) {
            if (error) {
                console.error(error);
                return;
            }
            callback(footobjs);
        });
    });
}
exports.getFeet = getFeet;
function getUsers(callback) {
    db.collection('users', function (error, users_collection) {
        if (error) {
            console.error(error);
            return;
        }
        users_collection.find({}, { '_id': 1 }).toArray(function (error, userobjs) {
            if (error) {
                console.error(error);
                return;
            }
            callback(userobjs);
        });
    });
}
exports.getUsers = getUsers;
function getImage(imageId, callback) {
    db.collection('images', function (error, images_collection) {
        if (error) {
            console.error(error);
            return;
        }
        images_collection.find({ _id: new mongodb.ObjectID(imageId) }).batchSize(10).nextObject(function (error, image) {
            if (error) {
                console.error(error);
                return;
            }
            callback(image);
        });
    });
}
exports.getImage = getImage;
function getImages(imageIds, callback) {
    db.collection('images', function (error, images_collection) {
        if (error) {
            console.error(error);
            return;
        }
        images_collection.find({ _id: { $in: imageIds } }).toArray(function (error, images) {
            callback(images);
        });
    });
}
exports.getImages = getImages;
function addBoard(userid, title, description, callback) {
    db.collection('users', function (error, users) {
        if (error) {
            console.error(error);
            return;
        }
        users.update({ _id: userid }, { "$push": { boards: { title: title, description: description, images: [] } } }, function (error, user) {
            if (error) {
                console.error(error);
                return;
            }
            callback(user);
        });
    });
}
exports.addBoard = addBoard;
function addPin(userid, boardid, imageUri, link, caption, callback) {
    db.collection('images', function (error, images_collection) {
        if (error) {
            console.error(error);
            return;
        }
        images_collection.insert({
            user: userid,
            caption: caption,
            imageUri: imageUri,
            link: link,
            board: boardid,
            comments: []
        }, function (error, image) {
            console.log(image);
            db.collection('users', function (error, users) {
                if (error) {
                    console.error(error);
                    return;
                }
                users.update({ _id: userid, "boards.title": boardid }, { "$push": { "boards.$.images": image[0]._id } }, function (error, user) {
                    callback(user);
                });
            });
        });
    });
}
exports.addPin = addPin;
//# sourceMappingURL=db.js.map