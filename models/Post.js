const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userPostedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: String,
    amountOfLike: {
        type: Number,
        default: 0
    }
});

PostSchema.method("transform", function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    return obj;
});

const Post = new mongoose.model("Post", PostSchema);

module.exports = {
    PostSchema,
    Post
};
