'use strict';
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.Promise = global.Promise;

const ActivitySchema = mongoose.Schema({
    "activityId": Number,
    "calories": Number,
    "description": String,
    "distance": Number,
    "duration": Number,
    "name": String,
    "user": String,
    "created": Date,
    "date": Date,
    "comment": String,
});

ActivitySchema.methods.serialize = function () {
    return {
        user: this.user || '',
        name: this.name || '',
        calories: this.calories || 0,
        duration: this.duration  || 0,
        distance: this.distance || 0,
        created: this.created || "",
        date: this.date || ''
    };
};

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = {
    Activity
};