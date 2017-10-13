const express = require('express');
const Sequelize = require('sequelize');
const cors = require("cors");

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/server-config.json`)[env];

const app = express();
app.disable('x-powered-by');
app.use(cors());

app.use(express.static(__dirname + '/build'));
app.listen(3000, () => {
  console.log('Server running on port 3000')
});

// const db = new Sequelize('novella', 'root', 'password', {
//   dialect: 'mysql',
//   pool: {
//     maxConnections: 8,
//     maxIdleTime: 30
//   }
// });
const db = new Sequelize(config);

const Sync = (force) => {
  return db.sync({
    force: force
  });
};

const Stories = db.define('stories', {
  title: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
});

const Users = db.define('users', {
  username: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
});

const Sentences = db.define('sentences', {
  content: {
    type: db.Sequelize.STRING,
    allowNull: false
  }
});

Sentences.belongsTo(Stories);
Sentences.belongsTo(Users);
Stories.hasMany(Sentences);
Users.hasMany(Sentences);

UsersModel = {
  createUser: (username, response=null) => {
    Users.create({
      username: username
    }).then(user => {
      console.log("User created: " + user.get({plain: true}).username);
      if (response) {
        response.send(user.get({plain: true}));
      }
    }).catch(err => {
      console.log("Unable to create user:\n" + err);
    });
  }
};

StoriesModel = {
  createStory: (title, response=null) => {
    Stories.create({
      title: title
    }).then(story => {
      console.log("Story created: " + story.get({plain: true}).title);
      if (response) {
        response.send(story.get({plain: true}));
      }
    }).catch(err => {
      console.log("Unable to create story:\n" + err);
    });
  }
};

SentencesModel = {
  createSentence: (content, UID, SID, response=null) => {
    Sentences.create({
      content: content,
      userId: UID,
      storyId: SID
    }).then(sen => {
      console.log("Sentence created: " + sen.get({plain: true}).content);
      if (response) {
        response.send(sen.get({plain: true}));
      }
    }).catch(err => {
      console.log("Unable to create sentence:\n" + err);
    });
  },
  queryStorySentences: (response, SID) => {
    Sentences.findAll({
      where: {
        storyId: SID
      }
    }).then(sentences => {
      const senObjects = [];
      sentences.map(sen => {
        senObjects.push(sen.get({plain: true}))
      });
      response.send(senObjects);
    }).catch(err => {
      console.log(err);
      response.json({status: -1, errors: ['Unable to fetch sentence', err]});
    });
  }
};

app.get('/api/initialize', (req, res) => {
  console.log('Starting initialization');

  Sync(true)
    .then(() => {
      console.log('synched');
      UsersModel.createUser("Anonymous");
      StoriesModel.createStory("Story of the Net");
      SentencesModel.createSentence("This is the beginning of a great story", 1, 1);
    })
    .catch(e => {
      console.log(e)
    });

  console.log('DB initialized');
});

app.get('/api/queryStorySentences', (req, res) => {
  console.log("Querying sentences...");
  req.query ?
    SentencesModel.queryStorySentences(res, req.query.sid) :
    console.log("Cannot get sentences: request query missing.");
});

app.get('/api/createSentence', (req, res) => {
  console.log("Creating sentence...");
  req.query ?
    SentencesModel.createSentence(req.query.cont, req.query.uid, req.query.sid, res) :
    console.log("Cannot create sentences: request query missing.");
});

module.exports = {
  Sync,
  UsersModel,
  StoriesModel,
  SentencesModel
};