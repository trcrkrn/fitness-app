'use strict';
require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: mealsRouter } = require('./meals');
const { router: activitiesRouter } = require('./activities');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const {ActivityLog, MealLog} = require('./models');

const app = express();


// Logging
app.use(morgan('common'));
app.use(bodyParser.json());

//Meal log endpoints

app.get('/meals', (req, res) => {
  MealLog
    .find()
    .then(posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error:'something went wrong'});
    });
});

app.get('/meals/:id', (req, res) => {
  MealLog
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'});
    });
});

app.post('/meals', (req, res) => {
  const requiredFields = ['created', 'mealName', 'calories'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = 'Missing \`${field}\` in request body';
      console.error(message);
      return res.status(400).send(message);
    }
  }

  MealLog
    .create({
      created: req.body.created,
      mealName: req.body.mealName,
      calories: req.body.mealName
    })
    .then(mealLog => res.status(201).json(mealLog.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error:'Something went wrong'});
    });
});

app.delete('/meals/:id', (req, res) => {
  MealLog
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message:'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'});
    });
});

app.put('/meals/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['created', 'mealname', 'calories', 'comment'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  MealLog
    .findByIdAndUpdate(req.params.id, {$set:updated}, {new:true})
    .then(updatedPost => res.status(200).json(updatedPost))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

app.delete('/:id', (req, res) => {
  MealLog
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

//Activity Log endpoints

app.get('/activities', (req, res) => {
  ActivityLog
    .find()
    .then(posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error:'something went wrong'});
    });
});

app.get('/acttivities/:id', (req, res) => {
  ActivityLog
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'});
    });
});

app.post('/activities', (req, res) => {
  const requiredFields = ['created', 'activityName', 'calories'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = 'Missing \`${field}\` in request body';
      console.error(message);
      return res.status(400).send(message);
    }
  }

  ActivityLog
    .create({
      created: req.body.created,
      activityName: req.body.activityName,
      calories: req.body.mealName
    })
    .then(activityLog => res.status(201).json(activityLog.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error:'Something went wrong'});
    });
});

app.delete('/activities/:id', (req, res) => {
  ActivityLog
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message:'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went wrong'});
    });
});

app.put('/activities/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['created', 'activityName', 'calories', 'comment'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  ActivityLog
    .findByIdAndUpdate(req.params.id, {$set:updated}, {new:true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

app.delete('/:id', (req, res) => {
  ActivityLog
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});


// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

//serve public assets here
app.use(express.static('public'));


//user authentication
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use('/api/meals/', jwtAuth, mealsRouter);
app.use('/api/activities/', jwtAuth, activitiesRouter);

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(database_url = DATABASE_URL) {
  return new Promise((resolve, reject) => {
    mongoose.connect(database_url, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
