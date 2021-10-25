const S3 = require('aws-sdk/clients/s3'),
    bucket = 'cdn.xenonrblx.com',
    s3 = new S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    });


exports.uploadGeneral = (file, name) => {
    s3.upload({
        Bucket: bucket,
        Body: file,
        Key: name
    }, (err, data) => {
        if (err) {
            return false;
        }
        return data;
    });
}

exports.uploadScript = (file, name) => {
    s3.upload({
        Bucket: bucket + '/scripts',
        Body: file,
        Key: name
    }, (err, data) => {
        if (err) {
            return false;
        }
        return data;
    });
}

exports.uploadAvatar = (file, name) => {
    s3.upload({
        Bucket: bucket + '/avatars',
        Body: file,
        Key: name
    }, (err, data) => {
        if (err) {
            return false;
        }
        return data;
    });
}