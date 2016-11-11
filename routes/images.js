var request = require('request').defaults({encoding: null});
var express = require('express');
var router = express.Router();
var cropImage = require('../modules/cropImage')

/* Crop Image. */
router.put('/:id', function(req, res, next) {
  request(req.body.fileName, function (error, response, body) {
    cropImage(req.body, req.body.fileName, function(err, data) {
      if(err) {
        res.status(err.code);
        res.send(err.message);
      } else {
        res.send(data);
      }
    });
  });
});

module.exports = router;
