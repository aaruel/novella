const express = require('express');
const Sequelize = require('sequelize');
const cors = require("cors");

const db = new Sequelize('novella', 'root', 'password', {
  dialect: 'mysql'
});

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

const Sync = (force) => {
  return db.sync({
    force: force
  });
};

UsersModel = {
  createUser: (username) => {
    Users.create({
      username: username
    }).then(user => {
      console.log("User created: " + user.get({plain: true}).username);
    }).catch(err => {
      console.log("Unable to create user:\n" + err);
    });
  }
};

StoriesModel = {
  createStory: (title) => {
    Stories.create({
      title: title
    }).then(story => {
      console.log("Story created: " + story.get({plain: true}).title);
    }).catch(err => {
      console.log("Unable to create story:\n" + err);
    });
  }
};

SentencesModel = {
  createSentence: (content, UID, SID) => {
    Sentences.create({
      content: content,
      userId: UID,
      storyId: SID
    }).then(sen => {
      console.log("Sentence created: " + sen.get({plain: true}).content);
    }).catch(err => {
      console.log("Unable to create user:\n" + err);
    });
  },
  queryStorySentences: (SID) => {
    Sentences.findAll({
      where: {
        storyId: SID
      }
    }).then(sentences => {
      console.log(sentences);
    }).catch(err => {
      console.log(err);
    });
  }
};

Sync(false)
.then(() => {
  console.log('synched');
  UsersModel.createUser("Anonymous");
  StoriesModel.createStory("Story of the Net");
  SentencesModel.createSentence("This is the beginning of a great story", 1, 1);
})
.catch(e => {
  console.log(e)
});

const app = express();
app.disable('x-powered-by');
app.use(cors());

app.use(express.static(__dirname + '/build'));
app.listen(3000, () => {
  console.log('Server running on port 3000')
});

console.log(SentencesModel.queryStorySentences(1));

app.get('/api/queryStorySentences', (req, res) => {
console.log('Received GET request');
  req.query ?
    Sync(false)
      .then(() => {
        res.send(SentencesModel.queryStorySentences(req.query.sid))
      })
      .catch(e => {
        console.log(e)
      }) :
    console.log('error');
});

module.exports = {
  Sync,
  UsersModel,
  StoriesModel,
  SentencesModel
};