var Jimp = require('jimp');
var s3Upload = require('./s3Upload');
var path = require('path');
var mime = require('mime-types');

module.exports = function (cropCoordinates, fileName, cb) {
    console.log('Request Received: ' + new Date());
    Jimp.read(fileName).then(
      function(image) {
        console.log('Image Read: ' + new Date());
        if(cropCoordinates.left < 0 || cropCoordinates.left > image.bitmap.width) {
          cb({'code': 403, 'message': 'Invalid left position'}, null);
          return;
        } else if(cropCoordinates.top < 0 || cropCoordinates.top > image.bitmap.height) {
          cb({'code': 403, 'message': 'Invalid top position'}, null);
          return;
        } else if(cropCoordinates.width < 0 || cropCoordinates.width + cropCoordinates.left > image.bitmap.width) {
          cb({'code': 403, 'message': 'Invalid width position'}, null);
          return;
        } else if(cropCoordinates.height < 0 || cropCoordinates.height + cropCoordinates.top > image.bitmap.height) {
          cb({'code': 403, 'message': 'Invalid height position'}, null);
          return;
        }

        var contentType = mime.contentType(path.extname(fileName));

        image.crop(
          cropCoordinates.left, 
          cropCoordinates.top, 
          cropCoordinates.width, 
          cropCoordinates.height
          ).getBuffer(contentType, function(err, croppedImage) {
            console.log('Buffer Read: ' + new Date());
            if(err) {
              cb({'code': 500, 'message': 'Error cropping file'}, null);
              return;
            } else {
              console.log('uploading ...' + new Date());
              s3Upload(path.basename(cropCoordinates.fileName), croppedImage, function(err, data) {
                console.log('Upload Done: ' + new Date());
                if(err) {
                  cb({'code': 500, 'message': 'Error cropping file'}, null);
                  return;
                } else {
                  cb(null, data.Location);
                  return;
                }
              });
            }
          });
      }
    ).catch(function(err){
      cb({'code': 500, 'message': 'Error cropping file'}, null);
      return;
    });
}