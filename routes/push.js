var express = require('express');
var router = express.Router();

module.exports = function(io) {
  /* empty post! */
  router.post('/', function(req,res) {
    console.log(req.body);

    if(!req.body.name || !req.body.message) {
      res.status(400).json({
        errorMessage : 'Missing arguments'
      });
    } else {
      io.sockets.emit('message',{
        name : req.body.name,
        message: req.body.message
      });
      res.send();
    }

  });

  router.get('/', function(req, res) {
    res.status(501).render('error', {
      message: 'Service not implemented',
      error: {}
    });
  });

  return router;
};








//module.exports = router;
