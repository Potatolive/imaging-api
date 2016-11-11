var aws = require('aws-sdk')
var mime = require('mime-types');
var path = require('path');
/**
 * @param fileName: filename to be saved
 * @param file: bufferd data
 */

S3_BUCKET = process.env.S3_BUCKET,
S3_DIRNAME = process.env.S3_DIRNAME,
AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY,
AWS_SECRET_KEY = process.env.AWS_SECRET_KEY,
AWS_REGION = process.env.AWS_REGION;
AWS_ACL = process.env.AWS_ACL;

defaultContentType = function(fileName) {
  return mime.contentType(path.extname(fileName)) || 'application/octet-stream';
}

module.exports = function (fileName, file, cb) {
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION
  })

  if(!fileName) {
      cb({'code': 403, 'message': 'File name is madatory'}, null);
      return;
  } else if (!file) {
      cb({'code': 403, 'message': 'Empty file cannot be created'}, null);
  }

  var s3bucket = new aws.S3({params: {Bucket: S3_BUCKET}});

  var params = {
      Key: fileName, 
      Body: file, 
      Expires: 120, 
      ContentType: defaultContentType(fileName),
      ACL: AWS_ACL
    };
  console.log('Upload Started: ' + new Date());
  s3bucket.upload(params, cb);
}