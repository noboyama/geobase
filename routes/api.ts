/// <reference path="./../node_modules/@types/express/index.d.ts" />

var express = require('express');
var router = express.Router();

var testjson = require("./../public/data/a.json");
/* GET home page. */
router.get('/get', function(req, res, next) {
	res.set('Content-Type', 'application/json');
	res.json(testjson);
});

module.exports = router;
