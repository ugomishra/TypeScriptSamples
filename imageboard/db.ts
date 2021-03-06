// Mongo
import mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongodb.Db('mydb', server, { w: 1 });
db.open(function() {});

export interface User {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    fbId: number;
    boards: Board[];
}

export interface Menu {
    _id: string;
    link: string;
    name: string;
}

export interface Foot {
    _id: string;
    link: string;
    name: string;
}

export interface Board {
    title: string;
    description: string;
    images: mongodb.ObjectID[];
}

export interface Image {
    _id: mongodb.ObjectID;
    user: string;
    caption: string;
    imageUri: string;
    link: string;
    board: string;
    comments: {text: string; user: string;}[];
}

export function getUser(id: string, callback: (user: User) => void) {
    db.collection('users', function(error, users) {
        if(error) { console.error(error); return; }
        users.find({_id: id}).batchSize(10).nextObject(function(error, user) {
            if(error) { console.error(error); return; }
            callback(user);
        });
    });
}

export function createUser(user ,callback: (user: User) => void) {
    // db.collection('users',)
}

export function checkUser(userbody ,callback: (auth: Boolean) => void) {
    db.collection('user', function(error, users){
        if(error) { console.error(error); return; }
        let user = users.find({name: userbody.name, pass: userbody.password});
        console.log(user);
    })
}

export function getMenus(callback: (menus: Menu[]) => void) {
    db.collection('menus', function(error, menus_collection) {
        if(error) { console.error(error); return; }
        menus_collection.find({}, { '_id': 1, 'href': 1, 'name': 1 }).toArray(function(error, menuobjs) {
           if(error) { console.error(error); return; }
           callback(menuobjs);
        });
    });
}

export function getFeet(callback: (feet: Foot[]) => void) {
    db.collection('feet', function(error, feet_collection) {
        if(error) { console.error(error); return; }
        feet_collection.find({}, { '_id': 1, 'href': 1, 'name': 1 }).toArray(function(error, footobjs) {
           if(error) { console.error(error); return; }
           callback(footobjs);
        });
    });
}

export function getUsers(callback: (users: User[]) => void) {
    db.collection('users', function(error, users_collection) {
        if(error) { console.error(error); return; }
        users_collection.find({}, { '_id': 1 }).toArray(function(error, userobjs) {
           if(error) { console.error(error); return; }
           callback(userobjs);
        });
    });
}

export function getImage(imageId: string, callback: (image: Image) => void) {
    db.collection('images', function(error, images_collection) {
        if(error) { console.error(error); return; }
        images_collection.find({_id: new mongodb.ObjectID(imageId)}).batchSize(10).nextObject(function(error, image) {
            if(error) { console.error(error); return; }
            callback(image);
        });
    });
}

export function getImages(imageIds: mongodb.ObjectID[], callback: (images: Image[]) => void) {
    db.collection('images', function(error, images_collection) {
        if(error) { console.error(error); return; }
        images_collection.find({_id: {$in: imageIds}}).toArray(function(error, images) {
            callback(images);
        });
    }); 
}

export function addBoard(userid: any, title: string, description: string, callback: (user: User) => void) {
    db.collection('users', function(error, users) {
        if(error) { console.error(error); return; }
        users.update(
            {_id: userid}, 
            {"$push": {boards: { title: title, description: description, images: []}}}, 
            function(error, user) {
                if(error) { console.error(error); return; }
                callback(user);
            }
        );
    });
}

export function addPin(userid: string, boardid: string, imageUri: string, link: string, caption: string, callback: (user: User) => void) {
    db.collection('images', function(error, images_collection) {
        if(error) { console.error(error); return; }
        images_collection.insert({
            user: userid,
            caption: caption,
            imageUri: imageUri,
            link: link,
            board: boardid,
            comments: []
        }, function(error, image) {
            console.log(image);
            db.collection('users', function(error, users) {
                if(error) { console.error(error); return; }
                users.update(
                    {_id: userid, "boards.title": boardid}, 
                    {"$push": {"boards.$.images": image[0]._id}},
                    function(error, user) {
                        callback(user);
                    }
                );
            })
        })
    })
}
