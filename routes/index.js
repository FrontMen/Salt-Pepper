var express = require('express');
var router = express.Router();

var io = require('socket.io')();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Frontmen Push Notifications' });
});

module.exports = router;
