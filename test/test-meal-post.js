'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {MealLog} = require('../models');
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function seedMealLogData() {
    console.info('seeding meal log data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            created: faker.date.recent(),
            mealName: faker.lorem.words(3),
            calories: faker.random.number(),
            comment: faker.lorem.text()
        });
    };
    return MealLog.insertMany(seedData);
};

describe('meal logs API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedMealLogData();
    });

    afterEach(function () {
        // tear down database so we ensure no state from this test
        // effects any coming after.
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('GET endpoint', function () {

        it('should return all existing meal logs', function () {
            let res;
            return chai.request(app)
                .get('/meals')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.length.of.at.least(1);
                    return MealLog.count();
                })
                .then(count => {
                    res.body.should.have.length.of(count);
                });
        });

        it('should return meal logs with right fields', function () {
            // Strategy: Get back all posts, and ensure they have expected keys

            let resPost;
            return chai.request(app)
                .get('/meals')
                .then(function (res) {

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    res.body.forEach(function (post) {
                        post.should.be.a('object');
                        post.should.include.keys('id', 'mealName', 'comment', 'created', 'calories');
                    });
                    // just check one of the posts that its values match with those in db
                    // and we'll assume it's true for rest
                    resPost = res.body[0];
                    return MealLog.findById(resPost.id);
                })
                .then(post => {
                    resPost.mealName.should.equal(post.mealName);
                    resPost.comment.should.equal(post.comment);
                    resPost.created.should.equal(post.created);
                    resPost.calories.should.equal(post.calories);
                });
        });
    });

    describe('POST endpoint', function () {
        // strategy: make a POST request with data,
        // then prove that the post we get back has
        // right keys, and that `id` is there (which means
        // the data was inserted into db)
        it('should add a new meal log', function () {

            const newPost = {
                created: faker.date.recent(),
                mealName: faker.random.bs_noun(),
                calories: faker.random.number(),
                comment: faker.lorem.text()
            };

            return chai.request(app)
                .post('/meals')
                .send(newPost)
                .then(function (res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys(
                        'id', 'created', 'mealName', 'calories', 'comment');
                    res.body.created.should.equal(newPost.created);
                    res.body.id.should.not.be.null;
                    res.body.mealName.should.equal(newPost.mealName);
                    res.body.calories.should.equal(newPost.calories);
                    res.body.comment.should.equal(newPost.comment);
                    return MealLog.findById(res.body.id);
                })
                .then(function (post) {
                    post.mealName.should.equal(newPost.mealName);
                    post.calories.should.equal(newPost.calories);
                    post.comment.should.equal(newPost.comment);
                    post.created.should.equal(newPost.created);
                });
        });
    });

    describe('PUT endpoint', function () {

        // strategy:
        //  1. Get an existing post from db
        //  2. Make a PUT request to update that post
        //  4. Prove post in db is correctly updated
        it('should update fields you send over', function () {
            const updateData = {
                created: 1522732432,
                mealName: "bowl of cereal, 1 cup of milk",
                calories: 125,
                comment: "tasted great"
            };

            return MealLog
                .findOne()
                .then(post => {
                    updateData.id = post.id;

                    return chai.request(app)
                        .put(`/meals/${post.id}`)
                        .send(updateData);
                })
                .then(res => {
                    res.should.have.status(204);
                    return MealLog.findById(updateData.id);
                })
                .then(post => {
                    post.created.should.equal(updateData.created);
                    post.mealName.should.equal(updateData.mealName);
                    post.calories.should.equal(updateData.calories);
                    post.comment.should.equal(updateData.comment);
                });
        });
    });
    describe('DELETE endpoint', function () {
        // strategy:
        //  1. get a post
        //  2. make a DELETE request for that post's id
        //  3. assert that response has right status code
        //  4. prove that post with the id doesn't exist in db anymore
        it('should delete a post by id', function () {

            let post;

            return MealLog
                .findOne()
                .then(_post => {
                    post = _post;
                    return chai.request(app).delete(`/meals/${post.id}`);
                })
                .then(res => {
                    res.should.have.status(204);
                    return MealLog.findById(post.id);
                })
                .then(_post => {
                    // when a variable's value is null, chaining `should`
                    // doesn't work. so `_post.should.be.null` would raise
                    // an error. `should.be.null(_post)` is how we can
                    // make assertions about a null value.
                    should.not.exist(_post);
                });
        });
    });
});