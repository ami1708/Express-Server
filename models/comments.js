const mongoose = require("mongoose");
//creating a schema for user data in mongoose
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true, //without this data wont be saved
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    //written to show  created and updated at
    timestamps: true,
  }
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
