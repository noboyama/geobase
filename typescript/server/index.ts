
/// <reference path="./../../node_modules/@types/express/index.d.ts" />
/// <reference path="./../../node_modules/@types/mongodb/index.d.ts" />
/// <reference path="./../../node_modules/@types/es6-promise/index.d.ts" />

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;