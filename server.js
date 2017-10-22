const helmet = require('helmet');
const express = require('express');
const Sequelize = require('sequelize');
const cors = require("cors");
const env = process.env.NODE_ENV || 'development';
const dbConfig = require(`${__dirname}/server-config.json`)[env];

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(helmet());
app.use(cors());

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.use(express.static(__dirname + '/build'));

// Socket logic
io.on('connection', (socket) => {
  console.log('New user connected');
  socket.on('new sentence', () => {
    console.log('new sentence');
    socket.broadcast.emit('new sentence');
  });
});

const db = new Sequelize(dbConfig);

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

// Models
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
    if (content) {
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
    }
    else {
      response.send({status: -1, error: "Sentence cannot be empty"});
    }
  },
  // createSentence: async (content, UID, SID, response=null) => {
  //   try {
  //     const sen = await Sentences.create({
  //       content: content,
  //       userId: UID,
  //       storyId: SID
  //     });
  //     console.log("Sentence created: " + await sen.get({plain: true}).content);
  //     if (response) {
  //       response.send(sen.get({plain: true}));
  //     }
  //   }
  //   catch (err) {
  //     response.send({status: -1, error: "Sentence cannot be empty"});
  //   }
  // },
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
      console.log("Sentences loaded");
    }).catch(err => {
      console.log(err);
      response.json({status: -1, errors: ['Unable to fetch sentence', err]});
    });
  }
  // queryStorySentences: async (response, SID) => {
  //   try {
  //     const sentences = await Sentences.findAll({
  //       where: {
  //         storyId: SID
  //       }
  //     });
  //     const senObjects = [];
  //     sentences.map(sen => {
  //       senObjects.push(sen.get({plain: true}))
  //     });
  //     response.send(senObjects);
  //   }
  //   catch(err) {
  //     console.log(err);
  //     response.json({status: -1, errors: ['Unable to fetch sentence', err]});
  //   }
  // }
};

// Routes
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
  UsersModel,
  StoriesModel,
  SentencesModel
};