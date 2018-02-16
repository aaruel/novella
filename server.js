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
    console.log('Socket.IO: new sentence');
    socket.broadcast.emit('new sentence');
  });
  socket.on('sentence accepted', () => {
    console.log('Socket.IO: sentence accepted');
    socket.broadcast.emit('sentence accepted');
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
// in vote values:
// 0: in story
// 1: in vote queue
// 2: rejected
const Sentences = db.define('sentences', {
  content: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  inVote: {
    type: db.Sequelize.INTEGER,
    validate: {
      min: 0,
      max: 2
    },
    allowNull: false
  },
  round: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  votes: {
    type: db.Sequelize.INTEGER,
    validate: {
      min: 0
    },
    allowNull: false
  }
});
const Votes = db.define('votes', {
  senId: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  userId: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

Sentences.belongsTo(Stories);
Sentences.belongsTo(Users);
Stories.hasMany(Sentences);
Users.hasMany(Sentences);

dbModel = {
  initialize: () => {
    Sync(true)
      .then(() => {
        UsersModel.createUser("Anonymous");
        StoriesModel.createStory("Story of the Net");
        // content, invote, round, userId, storyId
        SentencesModel.createSentence({
          content: "This is the beginning of a great story",
          invote: 0,
          round: 0
        }, 1, 1);
        console.log('Initialization successful');
      })
      .catch(e => {
        console.log(e)
      });
  },
  querySentences: (SID, from, response) => {
    let query = `SELECT sentences.*, users.username AS author ` +
      `FROM sentences, users ` +
      `WHERE sentences.storyId = ${SID}`;
    if (from === "all" || from === "active") {
      query += ';';
    }
    else if (from === "story") {
      query += ' AND sentences.inVote = 0;';
    }
    else if (from === "voting") {
      query += ' AND sentences.inVote = 1;';
    }
    else if (from === "rejected") {
      query += ' AND sentences.inVote = 2;';
    }
    db.query(query)
      .then(sens => {
        response.send(sens[0]);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

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
  },
  queryUser: (UID, response=null) => {
    Users.find({
      where: {
        id: UID
      }
    }).then(user => {
      if (response) {
        response.send(user.get({plain: true}));
      }
      console.log("User returned: " + user.get({plain: true}).username);
    }).catch(err => {
      console.log(err);
      response.json({status: -1, errors: ['Unable to fetch user', err]});
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
  querySentence: (SENID, response) => {
    Sentences.find({
      where: {
        id: SENID
      }
    }).then(sen => {
      console.log(sen.get({plain: true}))
      response.send(sen.get({plain: true}));
    }).catch(err => {
      console.log(err);
    });
  },
  createSentence: (senObj, UID, SID, response = null) => {
    try {
      Sentences.create({
        content: senObj.content,
        inVote: senObj.invote,
        round: senObj.round,
        votes: 0,
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
    catch(err) {
      console.log(err);
      response.send({status: -1, error: "Sentence cannot be empty"});
    }
  },
  handleSentenceChange: (SENID, action, response) => {
    Sentences.find({
      where: {
        id: SENID
      }
    }).then(sen => {
      let newSen = sen.get({plain: true});
      if (action === "vote" || action === "unvote") {
        let newVotes = parseInt(newSen.votes);
        sen.update({
          votes: action === "vote" ? newVotes + 1 : newVotes - 1
        });
      }
      else if (action === "accept" || action === "reject") {
        sen.update({
          inVote: action === "accept" ? 0 : 2
        });
      }
      response.send(sen);
    }).catch(err => {
      console.log(err);
      response.send({status: -1, error: "Sentence vote failed"});
    });
  },
  submitSentence: (SID, response) => {
    Sentences.find({
      where: {
        id: SID
      }
    }).then(sen => {

    }).catch(err => {
      console.log(err);
      response.send({status: -1, error: "Sentence submission failed"});
    });
  },
  deleteSentence: (SID) => {
    Sentences.destroy({
      where: {
        id: SID
      }
    }).then(sen => {
      console.log("Sentence deleted: " + sen.get({plain: true}).content);
    }).catch(err => {
      console.log(err);
    })
  }
};

// Routes
app.get('/api/initialize', () => {
  console.log('Starting initialization');
  dbModel.initialize();
});

app.get('/api/querySentences', (req, res) => {
  console.log(`Querying sentences...`);
  req.query ?
    dbModel.querySentences(req.query.sid, req.query.from, res) :
    console.log("Cannot get sentences: request query missing.");
});

app.get('/api/submitSentence', (req, res) => {
  console.log("Submitting sentence to story");
  req.query ?
    dbModel.submitSentence(req.query.sid, res) :
    console.log("Cannot submit sentence: request query missing.");
});

app.get('/api/queryUser', (req, res) => {
  console.log("Querying user...");
  req.query ?
    UsersModel.queryUser(req.query.uid, res) :
    console.log("Cannot get user: request query missing.");
});

app.get('/api/querySentence', (req, res) => {
  console.log("Querying sentence...");
  req.query ?
    UsersModel.querySentence(req.query.senid, res) :
    console.log("Cannot get sentence: request query missing.");
});

app.get('/api/createSentence', (req, res) => {
  console.log("Creating sentence...");
  req.query ?
    SentencesModel.createSentence({
      content: req.query.cont,
      invote: req.query.invote,
      round: req.query.round
    }, req.query.uid, req.query.sid, res) :
    console.log("Cannot create sentences: request query missing.");
});

app.get('/api/sentenceChange', (req, res) => {
  console.log("Sentence vote");
  req.query ?
    SentencesModel.handleSentenceChange(req.query.senid, req.query.action, res) :
    console.log("Cannot vote on sentence: request query missing.");
});

app.get('/api/sentenceDelete', (req, res) => {
  console.log("Deleting sentence");
  req.query ?
    SentencesModel.deleteSentence(req.query.senid) :
    console.log("Cannot delete sentence: no sentence id provided.");
});

module.exports = {
  UsersModel,
  StoriesModel,
  SentencesModel
};