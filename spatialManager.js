/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : new Map(),

// PUBLIC METHODS

getNewSpatialID : function() {

    let id = this._nextSpatialID;
    this._nextSpatialID += 1;
    return id;
},

register: function(entity) {

    var spatialID = entity.getSpatialID();
    
    this._entities.set(spatialID, {
        pos : entity.getPos(),
        radius : entity.getRadius(),
        entity : entity
    });
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    this._entities.delete(spatialID);
},

reset: function() {
    this._entities = new Map();
},

findEntityInRange: function(posX, posY, radius) {

    let iter = this._entities.entries();
    let entity = iter.next();
    let hit = null;

    while (!entity.done) {
        let l = entity.value[1];
        let dSq = util.distSq(posX, posY, l.pos.posX, l.pos.posY);
        let rSq = util.square(radius + l.radius);

        if (dSq < rSq) { hit = l.entity; }

        entity = iter.next();
    }

    return hit;
},

render: function(ctx) {

    let iter = this._entities.entries();

    ctx.save();
    ctx.strokeStyle = "#ff0000";
    
    let entity = iter.next();

    while (!entity.done) {
        let l = entity.value[1];
        util.strokeCircle(ctx, l.pos.posX, l.pos.posY, l.radius);
        entity = iter.next();
    }
    
    ctx.restore();

}

}
