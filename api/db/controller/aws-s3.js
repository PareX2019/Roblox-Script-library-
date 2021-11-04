const S3 = require('aws-sdk/clients/s3'),
    bucket = 'cdn.xenonrblx.com',
    s3 = new S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    });


exports.uploadGeneral = (file, name) => {
   return s3.upload({
        Bucket: bucket,
        Body: file,
        Key: name
    }).promise();
}

exports.uploadScript = (file, name) => {
    return s3.upload({
        Bucket: bucket + '/scripts',
        Body: file,
        Key: name
    }).promise();
}

exports.uploadAvatar = (file, name) => {
    return s3.upload({
        Bucket: bucket + '/avatars',
        Body: file,
        Key: name
    }).promise();
}

exports.uploadThubnail = (file, name) => {
    return s3.upload({
        Bucket: bucket + '/thubnails',
        Body: file,
        Key: name
    }).promise();
}