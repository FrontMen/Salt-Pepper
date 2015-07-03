var express = require('express');
var router = express.Router();
var io = require('socket.io')();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(io.sockets);
  res.render('connections',
      { title: 'All them connections!',
        connections: []
      }
  );
});

module.exports = router;