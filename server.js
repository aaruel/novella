const express = require('express');
// const Sequelize = require('sequelize');
//
// const db = new Sequelize('mysql://localhost/novella', 'root', process.env.pswd, {
//   dialect: 'mysql'
// });
//
// const Stories = db.define('stories', {
//   title: {
//     type: db.Sequelize.STRING,
//     unique: true,
//     allowNull: false
//   }
// }, {
//   timestamps: false
// });
//
// const Users = db.define('users', {
//   username: {
//     type: db.Sequelize.STRING,
//     unique: true,
//     allowNull: false
//   }
// }, {
//   timestamps: false
// });
//
// const Sentences = db.define('sentences', {
//   content: {
//     type: db.Sequelize.TEXT,
//     unique: true,
//     allowNull: false
//   }
// });
//
// Sentences.belongsTo(Stories);
// Sentences.belongsTo(Users);
// Stories.hasMany(Sentences);
// Users.hasMany(Sentences);
//
// const Sync = () => {
//   return db.sync({
//     force: true
//   });
// };
//
// Sync()
//   .then(() => console.log('synched'))
//   .catch(e => console.log(e));

const app = express();
app.disable('x-powered-by');

app.use('/build', express.static(__dirname + '/build'));
app.listen(3000, () => {
  console.log('Server running on port 3000')
});
