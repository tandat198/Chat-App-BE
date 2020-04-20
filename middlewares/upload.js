const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const BUCKET_NAME = "portfolio-dn";
const ID = "AKIAISIE5TPSIPG2IUXA";
const SECRET = "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";

const s3 = new aws.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: BUCKET_NAME,
        acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: `${file.originalname}` });
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now().toString()}`);
        }
    }),
    limits: {
        fileSize: 3 * Math.pow(1024, 2)
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
            return res.status(200).json({ linkUrl: req.file.location });
        }
    });
};

const uploadAvatar = (req, res) => {
    uploadSingle("profile", req, res);
};

module.exports = {
    uploadAvatar
};
