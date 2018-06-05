'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {
    Meal
} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new meal
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['name', 'mealId'];
    const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }
    req.body.created = Date.parse(req.body.created);
    req.body.date = Date.parse(req.body.date);
    console.log(req.body);
    return Meal.create(req.body)
        .then(meal => {
            return res.status(201).json(meal.serialize());
        })
        .catch(err => {
            // Forward validation errors on to the client, otherwise give a 500
            // error because something unexpected has happened
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
    return Meal.find()
        .then(users => res.json(users.map(user => user.serialize())))
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

var mealSuccess =  (res, meals) => {
    const serializedMeals = meals.map(meal => meal.serialize());
    res.status(200).json(serializedMeals);
    return res.status(201).json(meal.serialize());
};

var mealCatch = (res, err) => {
    console.log(err);
    if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
    }
    res.status(404).json({
        code: 404,
        message: 'Not found'
    });
};

router.get('/:startdate', (req, res, next) => {
    let start = Date.parse(req.params.startdate);
    let end = start + 1000 * 60 *60 *24; //add day
    if(start <1) {
        return res.status(422).json({
            code:422,
            message: 'Invalid start date'
        })
    }
    Meal.find({"user" : req.user.username, "date": {"$gte": start, "$lt":end}})
    .then(meals => mealSuccess(res, meals) 
)
.catch(err => mealCatch(res, err) 
)
})

router.get('/:startdate/:enddate', (req, res, next) => {
    let start = Date.parse(req.params.startdate);
    let end = Date.parse(req.params.enddate);
    if(start <1) {
        return res.status(422).json({
            code:422,
            message: 'Invalid start date'
        })
    }
    if(end <1) {
        return res.status(422).json({
            code:422,
            message: 'Invalid end date'
        })
    }
    Meal.find({"user" : req.user.username, "date": {"$gte": start, "$lt": end}})
    .then(meals => mealSuccess(res, meals) 
)
.catch(err => mealCatch(res, err) 
)
})

// Post to register a new meal

function calculateCalories(foods) {
    console.log(foods);
    return foods.reduce(function(previousValue,currentValue) {
        console.log({previousValue, currentValue})
        return previousValue + currentValue.calories
    }, 0);
};

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['name', 'mealId'];
    const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }
    req.body.created = Date.parse(req.body.created);
    req.body.date = Date.parse(req.body.date);
    const calories = calculateCalories(req.body.foods);
    console.log("calories:", calories);
    req.body.calories = calculateCalories(req.body.foods);
    console.log(req.body);
    return Meal.create(req.body)
        .then(meal => {
            return res.status(201).json(meal.serialize());
        })
        .catch(err => {
            // Forward validation errors on to the client, otherwise give a 500
            // error because something unexpected has happened
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        });
});

module.exports = {
    router
};