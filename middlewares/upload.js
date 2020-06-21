const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const { bucket, accessKeyId, secretAccessKey } = require('../config')

const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket,
        acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: `${file.originalname}` });
        },
        key: function (req, file, cb) {
            const splitOfFileName = file.originalname.split(".");
            const fileType = splitOfFileName[splitOfFileName.length - 1];
            const newFileName = `${uuidv4()}.${fileType}`;
            cb(null, newFileName);
        }
    }),
    limits: {
        fileSize: 3 * Math.pow(1024, 2)
    },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        return callback(null, true);
    }
});

const uploadSingle = (type, req, res) => {
    return upload.single(type)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            ["name", "storageErrors"].forEach(e => delete err[e]);
            return res.status(400).json({ error: err });
        } else if (err) {
            return res.status(400).json({ error: err });
        } else {
            console.log(req.file)
            return res.status(200).json({ linkUrl: req.file.location });
        }
    });
};

const uploadSingleImage = (req, res) => {
    uploadSingle("profile", req, res);
};

module.exports = {
    uploadSingleImage
};
