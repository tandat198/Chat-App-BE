const multer = require("multer");
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage, limits: { fileSize: 3 * Math.pow(1024, 2) } }).single("profile");

// const upload = (req, res, next) => {
//     return upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             console.log(err);
//             // A Multer error occurred when uploading.
//         } else if (err) {
//             // An unknown error occurred when uploading.
//         }

//         // Everything went fine.
//     });
// };

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = type => {
    return multer({ storage, limits: { fileSize: 2 * Math.pow(1024, 2) } }).single(type);
};

module.exports = upload;
