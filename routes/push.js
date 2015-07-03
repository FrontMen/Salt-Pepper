var express = require('express');
var router = express.Router();
var io = require('socket.io')();

/* empty post! */
router.post('/', function(req,res) {
  console.log(req.body);

  if(!req.body.name || !req.body.message) {
    res.status(400).json({
      errorMessage : 'Missing arguments'
    });
  } else {
    io.sockets.emit('an event sent to all connected clients');
    res.send();
  }

});

router.get('/', function(req, res) {
  res.status(501).render('error', {
    message: 'Service not implemented',
    error: {}
  });
});

module.exports = router;
