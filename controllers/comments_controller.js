const Comment = require("../models/comments");
const Post = require("../models/post");
const { removeListener } = require("../models/comments");
const commentMailer = require("../.vscode/mailer/comments_mailer")
module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();
      comment = await comment.populate('user','name').execPopulate();
       if (req.xhr) {
         return res.status(200).json({
           data: {
             //we get the data from above variable post
             post: post,
           },
           message: "Post created!",
         });
       }

      req.flash("success", "Comment published!");

      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;

      comment.remove();

      let post = Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "comment deleted successfully",
        });
      }

      req.flash("success", "Comment deleted!");

      return res.redirect("back");
    } else {
      req.flash("error", "Unauthorized");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return;
  }
};

// const Comment = require('../models/comments');
// const Post = require('../models/post');
// module.exports.create = function(req,res){
// Post.findById(req.body.post ,function(err,post){

//     if(post){
//         Comment.create({
//             content :req.body.content,
//             post: req.body.post,
//             user: req.user._id
//         },
//         function(err,comment){
//             //Handled error skipped
//             post.comments.push(comment); //given by mongodb automatically fetched the post id
//             post.save() //save the comment in the db
//             res.redirect('/')
//         })
//     }
// })

// }
