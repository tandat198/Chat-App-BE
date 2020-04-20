const { Post } = require("../../../models/Post");

const postNewPost = (req, res) => {
    const { title } = req.body;

    const post = new Post({
        title
    });

    await post.save();
};

module.exports = {
    postNewPost
};