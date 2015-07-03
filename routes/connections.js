var express = require('express');
var router = express.Router();

module.exports = function(io) {

    /* GET home page. */
    router.get('/', function(req, res, next) {
        var findClientsSocket = function (options) {
            var roomId = options.roomId || null,
                namespace = options.namespace || null,
                element = options.element || null;

            var res = []
                , ns = io.of(namespace || "/");    // the default namespace is "/"

            if (ns) {
                for (var id in ns.connected) {
                    if (roomId) {
                        var index = ns.connected[id].rooms.indexOf(roomId);
                        if (index !== -1) {
                            if (element) {
                                res.push(ns.connected[id][element]);
                            } else {
                                res.push(ns.connected[id]);
                            }
                        }
                    } else {
                        if (element) {
                            res.push(ns.connected[id][element]);
                        } else {
                            res.push(ns.connected[id]);
                        }
                    }
                }
            }

            return res;
        };

      res.render('connections',
          { title: 'All them connections!',
            connections: findClientsSocket({'element': 'id'})
          }
      );
    });
    return router;
};