'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {ActivityLog} = require('../models');
const {closeServer, runServer,app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function seedActivityLogData() {
    console.info('seeding activity log data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            created: faker.date.recent(),
            activityName: faker.lorem.words(3),
            calories: faker.random.number(),
            comment: faker.lorem.text()
        });
    };
    return ActivityLog.insertMany(seedData);
};

describe('activity logs API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedActivityLogData();
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

        it('should return all existing activity logs', function () {
            let res;
            return chai.request(app)
                .get('/activities')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.length.of.at.least(1);
                    return ActivityLog.count();
                })
                .then(count => {
                    res.body.should.have.length.of(count);
                });
        });

        it('should return activity logs with right fields', function () {
            // Strategy: Get back all posts, and ensure they have expected keys

            let resPost;
            return chai.request(app)
                .get('/activities')
                .then(function (res) {

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    res.body.forEach(function (post) {
                        post.should.be.a('object');
                        post.should.include.keys('id', 'activityName', 'comment', 'created', 'calories');
                    });
                    // just check one of the posts that its values match with those in db
                    // and we'll assume it's true for rest
                    resPost = res.body[0];
                    return ActivityLog.findById(resPost.id);
                })
                .then(post => {
                    resPost.activityName.should.equal(post.activityName);
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
        it('should add a new activity log', function () {

            const newPost = {
                created: faker.date.recent(),
                activityName: faker.random.bs_noun(),
                calories: faker.random.number(),
                comment: faker.lorem.text()
            };

            return chai.request(app)
                .post('/activities')
                .send(newPost)
                .then(function (res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys(
                        'id', 'created', 'activityName', 'calories', 'comment');
                    res.body.created.should.equal(newPost.created);
                    res.body.id.should.not.be.null;
                    res.body.activityName.should.equal(newPost.activityName);
                    res.body.calories.should.equal(newPost.calories);
                    res.body.comment.should.equal(newPost.comment);
                    return ActivityLog.findById(res.body.id);
                })
                .then(function (post) {
                    post.activityName.should.equal(newPost.activityName);
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
                activityName: "ran 1 mile",
                calories: 125,
                comment: "not too bad"
            };

            return ActivityLog
                .findOne()
                .then(post => {
                    updateData.id = post.id;

                    return chai.request(app)
                        .put(`/activities/${post.id}`)
                        .send(updateData);
                })
                .then(res => {
                    res.should.have.status(204);
                    return ActivityLog.findById(updateData.id);
                })
                .then(post => {
                    post.created.should.equal(updateData.created);
                    post.activityName.should.equal(updateData.activityName);
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

            return ActivityLog
                .findOne()
                .then(_post => {
                    post = _post;
                    return chai.request(app).delete(`/activities/${post.id}`);
                })
                .then(res => {
                    res.should.have.status(204);
                    return ActivityLog.findById(post.id);
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