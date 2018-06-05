'use strict';
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.Promise = global.Promise;

const MealSchema = mongoose.Schema({
    "mealId": Number,
    "name": String,
    "description": String,
    "foods": [{
        "name": String,
        "description": String,
        "calories": Number,
        "servings": Number,
        "foodId": Number,
    }],
    "calories": Number,
    "user": String,
    "created": Date,
    "date": Date,
    "comment": String,
});

MealSchema.methods.serialize = function () {
    return {
        name: this.name || '',
        calories: this.calories || 0,
        created: this.created || Date.now(),
        date: this.date || '',
        comment: this.comment || '',
        foods: this.foods || []
    };
};

const Meal = mongoose.model('Meal', MealSchema);

module.exports = {
    Meal
};