'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mealLogSchema = mongoose.Schema({
    created: {type: Date, required: true},
    mealName: {type: String, required: true},
    calories: {type: Number, required: true},
    comment: {type: String}
})

mealLogSchema.methods.serialize = function() {
    return {
        id: this._id,
        created: this.created,
        mealName: this.mealName,
        calories: this.calories,
        comment: this.comment
    };
};

const activityLogSchema = mongoose.Schema({
    created: {type: Date, required: true},
    activityName: {type: String, required: true},
    calories: {type: Number, required: true},
    comment: {type: String}
})

activityLogSchema.methods.serialize = function() {
    return {
        id: this._id,
        created: this.created,
        activityName: this.activityName,
        calories: this.calories,
        comment: this.comment
    }
}

const MealLog = mongoose.model('MealLog', mealLogSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = {ActivityLog, MealLog}