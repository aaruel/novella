const express = require('express');
const Sequelize = require('sequelize');
const mysql = require('mysql');

const connection = new Sequelize('novella', 'root', 'password');

const app = express();
app.disable('x-powered-by');

app.use(express.static('build'));
app.listen(3000, () => {
  console.log('Server running on port 3000')
});
